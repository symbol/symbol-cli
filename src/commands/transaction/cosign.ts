/*
 *
 * Copyright 2018-present NEM
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
import chalk from 'chalk';
import {command, metadata, option} from 'clime';
import {
    AccountHttp,
    Address,
    AggregateTransaction,
    CosignatureTransaction,
    MultisigAccountGraphInfo,
    MultisigHttp,
    QueryParams,
    TransactionHttp,
} from 'nem2-sdk';
import {from, Observable, of} from 'rxjs';
import {catchError, filter, flatMap, map, switchMap, toArray} from 'rxjs/operators';
import {Profile} from '../../models/profile';
import {HashResolver} from '../../resolvers/hash.resolver';
import {SequentialFetcher} from '../../services/multisig.service';
import {AnnounceTransactionsOptions} from '../announce.transactions.command';
import {ProfileCommand} from '../profile.command';

export class CommandOptions extends AnnounceTransactionsOptions {
    @option({
        flag: 'h',
        description: 'Aggregate bonded transaction hash to be signed.',
    })
    hash: string;
}

@command({
    description: 'Cosign an aggregate bonded transaction',
})
export default class extends ProfileCommand {

    constructor() {
        super();
    }

    @metadata
    execute(options: CommandOptions) {
        this.spinner.start();
        const profile = this.getProfile(options);
        const account = profile.decrypt(options);
        const accountHttp = new AccountHttp(profile.url);
        const transactionHttp = new TransactionHttp(profile.url);
        let transactionWasFound = false;

        const hash = new HashResolver()
            .resolve(options, undefined, '\'Enter the aggregate bonded transaction hash to cosign: ');

        const networkCall = (address: Address) => accountHttp
            .getAccountPartialTransactions(address, new QueryParams(100))
            .toPromise();

        const sequentialFetcher = SequentialFetcher.create(networkCall);

        this.getSelfAndChildrenAddresses(profile)
            .pipe(
                switchMap((addresses) => sequentialFetcher.getTransactionsToCosign(addresses)),
                flatMap((transaction) => transaction),
                filter((_) => _.transactionInfo !== undefined
                    && _.transactionInfo.hash !== undefined
                    && _.transactionInfo.hash === hash),
            )
            .subscribe((transaction: AggregateTransaction) => {
                sequentialFetcher.kill();
                const cosignatureTransaction = CosignatureTransaction.create(transaction);
                const signedCosignature = account.signCosignatureTransaction(cosignatureTransaction);
                transactionWasFound = true;
                transactionHttp
                    .announceAggregateBondedCosignature(signedCosignature)
                    .subscribe(
                        () => {
                            this.spinner.stop(true);
                            console.log(chalk.green('Transaction cosigned and announced correctly.'));
                        }, (err) => {
                            this.spinner.stop(true);
                            err = err.message ? JSON.parse(err.message) : err;
                            console.log(chalk.red('Error'), err.body && err.body.message ? err.body.message : err);
                        });
            }, (err) => {
                this.spinner.stop(true);
                err = err.message ? JSON.parse(err.message) : err;
                console.log(chalk.red('Error'), err.body && err.body.message ? err.body.message : err);
            }, () => {
                if (!transactionWasFound) {
                    this.spinner.stop(true);
                    const text = `${chalk.red('Error')}`;
                    console.log(text, 'The profile', profile.name, 'cannot cosign the transaction with hash', hash, '.');
                }
            });
    }

    private getSelfAndChildrenAddresses(profile: Profile): Observable<Address[]> {
        return new MultisigHttp(profile.url)
            .getMultisigAccountGraphInfo(profile.address)
            .pipe(
                switchMap((graphInfo) => this.getAddressesFromGraphInfo(graphInfo)),
                catchError((ignored) => of([profile.address])),
            );
    }

    private getAddressesFromGraphInfo(
        graphInfo: MultisigAccountGraphInfo,
    ): Observable<Address[]> {
        const {multisigAccounts} = graphInfo;
        return from(
                [...multisigAccounts.keys()]
                .sort((a, b) => b - a), // Get addresses from top to bottom
            )
            .pipe(
                map((key) => multisigAccounts.get(key) || []),
                filter((x) => x.length > 0),
                flatMap((multisigAccountInfo) => multisigAccountInfo),
                map(({account}) => account.address),
                toArray(),
            );
    }
}
