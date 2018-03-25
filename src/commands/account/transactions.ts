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
import {command, metadata} from 'clime';
import {AccountHttp, PublicAccount} from 'nem2-sdk';
import {AccountTransactionsCommand, AccountTransactionsOptions} from '../../account.transactions.command';
import {OptionsResolver} from '../../options-resolver';

@command({
    description: 'Fetch transactions from account',
})
export default class extends AccountTransactionsCommand {

    constructor() {
        super();
    }

    @metadata
    execute(options: AccountTransactionsOptions) {
        this.spinner.start();

        const profile = this.getProfile(options);

        const publicAccount = PublicAccount.createFromPublicKey(
            OptionsResolver(options,
                'publickey',
                () => this.getProfile(options).account.publicKey,
                'Introduce the public key: '), profile.account.address.networkType);

        const accountHttp = new AccountHttp(profile.url);

        accountHttp.transactions(publicAccount, options.getQueryParams())
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
