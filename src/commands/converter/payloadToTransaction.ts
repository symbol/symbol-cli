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
import {Command, command, metadata, option} from 'clime';
import {ProfileOptions} from '../../interfaces/profile.command';
import {PayloadResolver} from '../../resolvers/payload.resolver';
import {TransactionService} from '../../services/transaction.service';

export class CommandOptions extends ProfileOptions {
    @option({
        flag: 'p',
        description: 'Transaction payload.',
    })
    payload: string;
}

@command({
    description: 'Payload -> Transaction converter.',
})
export default class extends Command {

    private readonly transactionService: TransactionService;
    constructor() {
        super();
        this.transactionService = new TransactionService();
    }

    @metadata
    execute(options: CommandOptions) {
        const transaction = new PayloadResolver().resolve(options);
        console.log(this.transactionService.formatTransactionToFilter(transaction));
    }
}
