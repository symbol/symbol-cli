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
import {BlockchainHttp, QueryParams, TransactionHttp} from 'nem2-sdk';
import {OptionsResolver} from '../../options-resolver';
import {ProfileCommand, ProfileOptions} from '../../profile.command';
import {TransactionService} from '../../service/transaction.service';

export class CommandOptions extends ProfileOptions {
    @option({
        flag: 'h',
        description: 'Blockchain height ',
    })
    height: string;
    @option({
        flag: 'n',
        description: '(optional) Number of transactions',
        default: 10,
    })
    numtransactions: number;

}

@command({
    description: 'Fetch block chain transactions ',
})
export default class extends ProfileCommand {
    private readonly transactionService: TransactionService;

    constructor() {
        super();
        this.transactionService = new TransactionService();
    }

    @metadata
    execute(options: CommandOptions) {
        this.spinner.start();
        const profile = this.getProfile(options);

        const blockchainHttp = new BlockchainHttp(profile.url);

        const height = OptionsResolver(options,
            'height',
            () => undefined,
            'Introduce the block chain height: ');

        blockchainHttp.getBlockTransactions(height, new QueryParams(options.numtransactions))
            .subscribe((transactions) => {
                this.spinner.stop(true);
                transactions.map((transaction) => {
                    console.log('\n' + this.transactionService.formatTransactionToFilter(transaction) + '\n');
                });
            }, (err) => {
                this.spinner.stop(true);
                let text = '';
                text += chalk.red('Error');
                console.log(text, err.response !== undefined ? err.response.text : err);
            });
    }
}
