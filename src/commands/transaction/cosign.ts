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
    CosignatureSignedTransaction,
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
    private profile: Profile;
    private options: CommandOptions;

    constructor() {
        super();
    }

    @metadata
    execute(options: CommandOptions) {
        this.spinner.start();
        this.options = options;
        this.profile = this.getProfile(this.options);

        const hash = new HashResolver()
            .resolve(options, undefined, '\'Enter the aggregate bonded transaction hash to cosign: ');

        const sequentialFetcher = this.getSequentialFetcher();

        this.getSelfAndChildrenAddresses(this.profile)
            .pipe(
                switchMap((addresses) => sequentialFetcher.getTransactionsToCosign(addresses)),
                flatMap((transaction) => transaction),
                filter((_) => _.transactionInfo !== undefined
                    && _.transactionInfo.hash !== undefined
                    && _.transactionInfo.hash === hash),
            )
            .subscribe((transaction: AggregateTransaction) => {
                sequentialFetcher.kill();
                const signedCosignature = this.getSignedAggregateBondedCosignature(transaction, hash);
                if (signedCosignature) {
                    this.announceAggregateBondedCosignature(signedCosignature);
                }
            }, (err) => {
                this.spinner.stop(true);
                err = err.message ? JSON.parse(err.message) : err;
                console.log(chalk.red('Error'), err.body && err.body.message ? err.body.message : err);
            });
    }

    /**
     * Creates a sequential fetcher instance loaded with a getAccountPartialTransactions function
     * @returns {SequentialFetcher}
     */
    private getSequentialFetcher(): SequentialFetcher {
        const networkCall = (address: Address) => new AccountHttp(this.profile.url)
            .getAccountPartialTransactions(address, new QueryParams(100))
            .toPromise();

        return SequentialFetcher.create(networkCall);
    }

    /**
     * Attempts to cosign an aggregated transaction cosignature
     * @param  {AggregateTransaction} transaction
     * @param  {string} hash of the transaction to be cosigned
     * @returns {CosignatureSignedTransaction | null}
     */
    private getSignedAggregateBondedCosignature(
        transaction: AggregateTransaction,
        hash: string,
    ): CosignatureSignedTransaction | null {
        try {
            const cosignatureTransaction = CosignatureTransaction.create(transaction);
            const account = this.profile.decrypt(this.options);
            return account.signCosignatureTransaction(cosignatureTransaction);
        } catch (err) {
            this.spinner.stop(true);
            const text = `${chalk.red('Error')}`;
            console.log(text, 'The profile', this.profile.name, 'cannot cosign the transaction with hash', hash, '.');
            return null;
        }
    }

    /**
     * Announces aggregate bonded cosignature
     * @param  {CosignatureSignedTransaction} signedCosignature
     * @returns {Promise<void>}
     */
    private async announceAggregateBondedCosignature(signedCosignature: CosignatureSignedTransaction): Promise<void> {
        try {
            await new TransactionHttp(this.profile.url)
                .announceAggregateBondedCosignature(signedCosignature)
                .toPromise();
            this.spinner.stop(true);
            console.log(chalk.green('Transaction cosigned and announced correctly.'));
        } catch (err) {
            this.spinner.stop(true);
            err = err.message ? JSON.parse(err.message) : err;
            console.log(chalk.red('Error'), err.body && err.body.message ? err.body.message : err);
        }
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
