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
    MultisigAccountInfo,
    MultisigHttp,
    QueryParams,
    TransactionHttp,
} from 'nem2-sdk';
import {Observable, of} from 'rxjs';
import {catchError, filter, map, mergeMap, toArray} from 'rxjs/operators';
import {Profile} from '../../models/profile';
import {HashResolver} from '../../resolvers/hash.resolver';
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
    async execute(options: CommandOptions) {
        this.spinner.start();
        const profile = this.getProfile(options);
        const account = await profile.decrypt(options);
        const accountHttp = new AccountHttp(profile.url);
        const transactionHttp = new TransactionHttp(profile.url);
        const hash = await new HashResolver()
            .resolve(options, undefined, '\'Enter the aggregate bonded transaction hash to cosign: ');

        this.getGraphAccounts(profile)
            .pipe(
                mergeMap((_) => _),
                mergeMap((address) => accountHttp.getAccountPartialTransactions(address, new QueryParams(100))),
                mergeMap((_) => _),
                filter((_) => _.transactionInfo !== undefined && _.transactionInfo.hash !== undefined &&
                    _.transactionInfo.hash === hash), // Filter transaction
                toArray(),
            )
            .subscribe((transactions: AggregateTransaction[]) => {
                if (!transactions.length) {
                    this.spinner.stop(true);

                    let text = '';
                    text += chalk.red('Error');
                    console.log(text, 'The profile', profile.name, 'cannot cosign the transaction with hash', hash, '.');
                } else {

                    const transaction = transactions[0];

                    const cosignatureTransaction = CosignatureTransaction.create(transaction);
                    const signedCosignature = account.signCosignatureTransaction(cosignatureTransaction);

                    transactionHttp.announceAggregateBondedCosignature(signedCosignature).subscribe(
                        () => {
                            this.spinner.stop(true);
                            console.log(chalk.green('Transaction cosigned and announced correctly.'));
                        }, (err) => {
                            this.spinner.stop(true);
                            err = err.message ? JSON.parse(err.message) : err;
                            console.log(chalk.red('Error'), err.body && err.body.message ? err.body.message : err);
                        });

                }
            }, (err) => {
                this.spinner.stop(true);
                err = err.message ? JSON.parse(err.message) : err;
                console.log(chalk.red('Error'), err.body && err.body.message ? err.body.message : err);
            });
    }

    private getGraphAccounts(profile: Profile): Observable<Address[]> {
        return new MultisigHttp(profile.url).getMultisigAccountGraphInfo(profile.address)
            .pipe(
                map((_) => {
                    let addresses: Address[] = [];
                    _.multisigAccounts.forEach((value: MultisigAccountInfo[], key: number) => {
                        if (key <= 0) {
                            addresses = addresses.concat(
                                value.map((cosignatory) => cosignatory.account.address));
                        }
                    });
                    return addresses;
                }),
                catchError((ignored) => of([profile.address])));
    }
}
