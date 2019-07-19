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
import {command, ExpectedError, metadata, option} from 'clime';
import {BlockHttp, Order, QueryParams} from 'nem2-sdk';
import {OptionsResolver} from '../../options-resolver';
import {ProfileCommand, ProfileOptions} from '../../profile.command';
import {TransactionService} from '../../service/transaction.service';

export class CommandOptions extends ProfileOptions {
    @option({
        flag: 'h',
        description: 'Block height',
    })
    height: number;

    @option({
        flag: 's',
        description: 'Page size between 10 and 100, defaults to 10',
    })
    pageSize: number;

    @option({
        flag: 'i',
        description: 'Id after which we want objects to be returned, defaults to empty',
    })
    id: string | undefined;

    @option({
        flag: 'o',
        description: 'Order of transactions. DESC. Newer to older. ASC. Older to newer. Defaults to DESC',
    })
    order: string;
}

@command({
    description: 'Gets transactions for a given block height',
})

export default class extends ProfileCommand {

    constructor() {
        super();
    }

    @metadata
    execute(options: CommandOptions) {
        let height: number;
        height =  OptionsResolver(options,
            'height',
            () => undefined,
            'Introduce the block height: ');
        if (height < 1) {
            throw new ExpectedError('The block height cannot be smaller than 1');
        }

        let pageSize: number;
        pageSize =  OptionsResolver(options,
            'pageSize',
            () => undefined,
            'Enter the page size (must be between 10 and 100, defaults to 10): ');
        if (!pageSize || pageSize < 10) {
            pageSize = 10;
        } else if (pageSize > 100) {
            pageSize = 100;
        }

        let id: string | undefined;
        id =  OptionsResolver(options,
            'id',
            () => undefined,
            'Id after which we want objects to be returned. (defaults to empty): ');

        let order: string;
        order =  OptionsResolver(options,
            'order',
            () => undefined,
            'Order of transactions. DESC. Newer to older. ASC. Older to newer. (defaults to DESC): ');
        if (order !== 'ASC') {
            order = 'DESC';
        }

        this.spinner.start();
        const profile = this.getProfile(options);
        const blockHttp = new BlockHttp(profile.url);

        blockHttp.getBlockTransactions(height, new QueryParams(pageSize, id, order === 'ASC' ? Order.ASC : Order.DESC))
            .subscribe((transactions: any) => {
                this.spinner.stop(true);
                let txt = `\n`;
                if (transactions.length > 0) {
                    transactions.map((transaction: any, index: number) => {
                        txt += '(' + (index + 1) + ')' + '.';
                        txt +=  new TransactionService().formatTransactionToFilter(transaction) + '\n\n';
                    });
                } else {
                    txt = '[]';
                }
                console.log(txt);
            }, (err) => {
                this.spinner.stop(true);
                let text = '';
                text += chalk.red('Error');
                console.log(text, err.response !== undefined ? err.response.text : err);
            });
    }
}
