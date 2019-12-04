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
import {AccountHttp} from 'nem2-sdk';
import {OptionsResolver} from '../../options-resolver';
import {WalletTransactionCommand, WalletTransactionOptions} from '../../wallet.transactions.command';

export class CommandOptions extends WalletTransactionOptions {
    @option({
        description: 'Wallet password.',
    })
    password: string;
}

@command({
    description: 'Fetch transactions from account',
})
export default class extends WalletTransactionCommand {

    constructor() {
        super();
    }

    @metadata
    execute(options: CommandOptions) {
        this.spinner.start();

        const wallet = this.getDefaultWallet(options);
        options.password = OptionsResolver(options,
            'password',
            () => undefined,
            'Introduce the wallet password: ');
        const account = wallet.getAccount(options.password.trim());
        const publicAccount = account.publicAccount;

        const accountHttp = new AccountHttp(wallet.url);

        accountHttp.getAccountTransactions(publicAccount.address, options.getQueryParams())
            .subscribe((transactions) => {
                this.spinner.stop(true);
                let text = '';
                transactions.map((transaction) => {
                    text += this.transactionService.formatTransactionToFilter(transaction) + '\n';
                });
                console.log(text === '' ? 'There aren\'t transactions' : text);
            }, (err) => {
                this.spinner.stop(true);
                let text = '';
                text += chalk.red('Error');
                console.log(text, err.response !== undefined ? err.response.text : err);
            });
    }
}
