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
import {BlockHttp, Order, QueryParams} from 'nem2-sdk';
import {ProfileCommand, ProfileOptions} from '../../profile.command';
import {HeightResolver} from '../../resolvers/height.resolver';
import {TransactionService} from '../../service/transaction.service';
import {HeightValidator} from '../../validators/block.validator';

export class CommandOptions extends ProfileOptions {
    @option({
        flag: 'h',
        description: 'Block height.',
        validator: new HeightValidator(),
    })
    height: string;

    @option({
        flag: 's',
        description: '(Optional) Page size between 10 and 100. Default: 10',
    })
    pageSize: number;

    @option({
        flag: 'i',
        description: '(Optional) Id after which we want objects to be returned.',
    })
    id: string;

    @option({
        flag: 'o',
        description: '(Optional): Order of transactions. DESC. Newer to older. ASC. Older to newer. Default: DESC',
    })
    order: string;
}

@command({
    description: 'Get transactions for a given block height',
})

export default class extends ProfileCommand {
    private readonly transactionService: TransactionService;

    constructor() {
        super();
        this.transactionService = new TransactionService();
    }

    @metadata
    async execute(options: CommandOptions) {

        this.spinner.start();
        const profile = this.getProfile(options);
        const blockHttp = new BlockHttp(profile.url);
        const height = await new HeightResolver().resolve(options);

        let pageSize = options.pageSize || 10;
        if (pageSize < 10) {
            pageSize = 10;
        } else if (pageSize > 100) {
            pageSize = 100;
        }

        const id =  options.id || '';

        let order = options.order;
        if (order !== 'ASC') {
            order = 'DESC';
        }

        blockHttp.getBlockTransactions(height, new QueryParams(pageSize, id, order === 'ASC' ? Order.ASC : Order.DESC))
            .subscribe((transactions: any) => {
                this.spinner.stop(true);
                let txt = '\n';
                if (transactions.length > 0) {
                    transactions.map((transaction: any, index: number) => {
                        txt += `(${index + 1}) - `;
                        txt +=  this.transactionService.formatTransactionToFilter(transaction) + '\n\n';
                    });
                } else {
                    txt = '[]';
                }
                console.log(txt);
            }, (err) => {
                this.spinner.stop(true);
                let text = '';
                text += chalk.red('Error');
                err = err.message ? JSON.parse(err.message) : err;
                console.log(text, err.body && err.body.message ? err.body.message : err);
            });
    }
}
