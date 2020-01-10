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
import * as Table from 'cli-table3';
import {HorizontalTable} from 'cli-table3';
import {command, metadata, option} from 'clime';
import {TransactionHttp, TransactionStatus} from 'nem2-sdk';
import {ProfileCommand, ProfileOptions} from '../../profile.command';
import {HashResolver} from '../../resolvers/hash.resolver';
import {TransactionService} from '../../service/transaction.service';

export class CommandOptions extends ProfileOptions {
    @option({
        flag: 'h',
        description: 'Transaction hash.',
    })
    hash: string;
}

export class TransactionStatusTable {
    private readonly table: HorizontalTable;
    constructor(public readonly status: TransactionStatus) {
        this.table = new Table({
            style: {head: ['cyan']},
            head: ['Property', 'Value'],
        }) as HorizontalTable;
        this.table.push(
            ['Group', status.group],
            ['Hash', status.hash],
        );
        if (status.code) {
            this.table.push(
                ['Status Code', status.code],
            );
        }
        if (status.deadline) {
            this.table.push(
                ['Deadline', status.deadline.value.toString()],
            );
        }
        if (status.height) {
            this.table.push(
                ['Height', status.height.toString()],
            );
        }
    }

    toString(): string {
        let text = '';
        text += '\n' + chalk.green('Transaction Status') + '\n';
        text += this.table.toString();
        return text;
    }
}

@command({
    description: 'Fetch transaction status',
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
        const hash = new HashResolver()
            .resolve(options);

        const transactionHttp = new TransactionHttp(profile.url);
        transactionHttp.getTransactionStatus(hash)
            .subscribe((status) => {
                this.spinner.stop(true);
                console.log(new TransactionStatusTable(status).toString());
            }, (err) => {
                this.spinner.stop(true);
                err = err.message ? JSON.parse(err.message) : err;
                console.log(chalk.red('Error'), err.body && err.body.message ? err.body.message : err);
            });
    }
}
