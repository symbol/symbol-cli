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
import { command, metadata, option } from 'clime';
import { TransactionGroup } from 'symbol-sdk';

import { SearchCommand, SearchOptions } from '../../interfaces/search.command';
import { FormatterService } from '../../services/formatter.service';
import { TransactionView } from '../../views/transactions/details/transaction.view';

/**
 * Search options
 */
export class TransactionSearchOptions extends SearchOptions {
    @option({
        description: '(Optional) The group of transaction.',
        default: 'confirmed',
    })
    group: string;

    @option({
        description: '(Optional) Filter by address involved in the transaction.',
    })
    address: string;

    @option({
        description: '(Optional) Filter by address of an account receiving the transaction.',
    })
    recipientAddress: string;

    @option({
        description: '(Optional) Public key of the account signing the entity.',
    })
    signerPublicKey: string;

    @option({
        description: '(Optional) Filter by block height.',
    })
    height: string;

    @option({
        description:
            '(Optional) Filter by transaction type. To filter by multiple transaction type, separate the transaction types with commas.',
    })
    type: string;
}

@command({
    description: 'Fetch transactions from account',
})
export default class extends SearchCommand {
    constructor() {
        super();
    }

    @metadata
    async execute(options: TransactionSearchOptions) {
        const profile = this.getProfile(options);

        this.spinner.start();
        const transactionHttp = profile.repositoryFactory.createTransactionRepository();
        transactionHttp.search({ group: TransactionGroup.Confirmed }).subscribe(
            (page) => {
                this.spinner.stop();

                if (!page.data.length) {
                    console.log(FormatterService.error('No data found; try changing the selection criteria'));
                }

                page.data.forEach((transaction) => {
                    new TransactionView(transaction).print();
                });
            },
            (err) => {
                this.spinner.stop();
                console.log(FormatterService.error(err));
            },
        );
    }
}
