/*
 *
 * Copyright 2018 NEM
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
    AggregateTransaction,
    CosignatureTransaction,
    MultisigAccountInfo,
    PublicAccount,
    QueryParams,
    TransactionHttp,
} from 'nem2-sdk';
import {Observable, of} from 'rxjs';
import {catchError, filter, map, mergeMap, toArray} from 'rxjs/operators';
import {Profile} from '../../model/profile';
import {OptionsResolver} from '../../options-resolver';
import {ProfileCommand, ProfileOptions} from '../../profile.command';

export class CommandOptions extends ProfileOptions {
    @option({
        flag: 'h',
        description: 'Aggregate bonded transaction hash to be signed',
    })
    hash: string;
}

@command({
    description: 'Cosign an announce aggregate bonded transaction',
})
export default class extends ProfileCommand {

    constructor() {
        super();
    }

    @metadata
    execute(options: CommandOptions) {
        const profile = this.getProfile(options);

        const accountHttp = new AccountHttp(profile.url);
        const transactionHttp = new TransactionHttp(profile.url);

        const hash = OptionsResolver(options,
            'hash',
            () => undefined,
            'Introduce aggregate bonded transaction hash to be signed: ');

        this.spinner.start();

        this.getGraphAccounts(profile)
            .pipe(
                mergeMap((_) => _),
                mergeMap((publicAccount) => accountHttp.aggregateBondedTransactions(publicAccount, new QueryParams(100))),
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
                    console.log(text, 'This aggregate bonded transaction for given hash in this profile');
                } else {

                    const transaction = transactions[0];

                    const cosignatureTransaction = CosignatureTransaction.create(transaction);
                    const signedCosignature = profile.account.signCosignatureTransaction(cosignatureTransaction);

                    transactionHttp.announceAggregateBondedCosignature(signedCosignature).subscribe(
                        () => {
                            this.spinner.stop(true);
                            console.log(chalk.green('Transaction cosigned and announced correctly'));
                        }, (err) => {
                            this.spinner.stop(true);

                            let text = '';
                            text += chalk.red('Error');
                            console.log(text, err.response !== undefined ? err.response.text : err);
                        });

                }
            }, (err) => {
                this.spinner.stop(true);
                let text = '';
                text += chalk.red('Error');
                console.log(text, err.response !== undefined ? err.response.text : err);
            });
    }

    private getGraphAccounts(profile: Profile): Observable<PublicAccount[]> {
        return new AccountHttp(profile.url).getMultisigAccountGraphInfo(profile.account.address)
            .pipe(
                map((_) => {
                    let publicAccounts: PublicAccount[] = [];
                    _.multisigAccounts.forEach((value: MultisigAccountInfo[], key: number) => {
                        if (key <= 0) {
                            publicAccounts = publicAccounts.concat(
                                value.map((cosignatory) => cosignatory.account));
                        }
                    });
                    return publicAccounts;
                }),
                catchError((ignored) => of([profile.account.publicAccount])));
    }
}
