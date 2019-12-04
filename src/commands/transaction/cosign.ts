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
import { command, metadata, option } from 'clime';
import {
    Account,
    AccountHttp,
    AggregateTransaction,
    CosignatureTransaction,
    MultisigAccountInfo, MultisigHttp,
    PublicAccount,
    QueryParams,
    TransactionHttp,
} from 'nem2-sdk';
import { Observable, of } from 'rxjs';
import { catchError, filter, map, mergeMap, toArray } from 'rxjs/operators';
import { Wallet } from '../../model/wallet';
import { OptionsResolver } from '../../options-resolver';
import { WalletCommand, WalletOptions } from '../../wallet.command';

export class CommandOptions extends WalletOptions {
    @option({
        flag: 'h',
        description: 'Aggregate bonded transaction hash to be signed.',
    })
    hash: string;

    @option({
        description: 'Wallet password.',
    })
    password: string;
}

@command({
    description: 'Cosign an aggregate bonded transaction',
})
export default class extends WalletCommand {

    constructor() {
        super();
    }

    @metadata
    execute(options: CommandOptions) {
        const wallet = this.getDefaultWallet(options);

        const accountHttp = new AccountHttp(wallet.url);
        const transactionHttp = new TransactionHttp(wallet.url);

        options.hash = OptionsResolver(options,
            'hash',
            () => undefined,
            'Introduce aggregate bonded transaction hash to be signed: ');

        options.password = OptionsResolver(options,
            'password',
            () => undefined,
            'Introduce the wallet password: ');
        const account = wallet.getAccount(options.password);

        this.spinner.start();

        this.getGraphAccounts(wallet, account)
            .pipe(
                mergeMap((_) => _),
                mergeMap((publicAccount) => accountHttp.getAccountPartialTransactions(publicAccount.address, new QueryParams(100))),
                mergeMap((_) => _),
                filter((_) => _.transactionInfo !== undefined && _.transactionInfo.hash !== undefined &&
                    _.transactionInfo.hash === options.hash), // Filter transaction
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
                    const signedCosignature = account.signCosignatureTransaction(cosignatureTransaction);

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

    private getGraphAccounts(wallet: Wallet, account: Account): Observable<PublicAccount[]> {
        return new MultisigHttp(wallet.url).getMultisigAccountGraphInfo(account.address)
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
                catchError((ignored) => of([account.publicAccount])));
    }
}
