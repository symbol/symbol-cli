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

import { ProfileCommand } from '../../interfaces/profile.command';
import { ProfileOptions } from '../../interfaces/profile.options';
import { HashResolver } from '../../resolvers/hash.resolver';
import { FormatterService } from '../../services/formatter.service';
import { TransactionView } from '../../views/transactions/details/transaction.view';

export class CommandOptions extends ProfileOptions {
    @option({
        flag: 'h',
        description: 'Transaction hash.',
    })
    hash: string;
}

@command({
    description: 'Fetch transaction info',
})
export default class extends ProfileCommand {
    constructor() {
        super();
    }

    @metadata
    async execute(options: CommandOptions) {
        const profile = this.getProfile(options);
        const hash = await new HashResolver().resolve(options);

        this.spinner.start();
        const transactionHttp = profile.repositoryFactory.createTransactionRepository();
        transactionHttp.getTransaction(hash, TransactionGroup.Confirmed).subscribe(
            (transaction) => {
                this.spinner.stop();
                new TransactionView(transaction).print();
            },
            (err) => {
                this.spinner.stop();
                console.log(FormatterService.error(err));
            },
        );
    }
}
