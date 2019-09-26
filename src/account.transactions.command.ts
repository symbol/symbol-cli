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
import {option} from 'clime';
import {QueryParams} from 'nem2-sdk';
import {ProfileCommand, ProfileOptions} from './profile.command';
import {TransactionCLIService} from './service/transaction.service';
import {PublicKeyValidator} from './validators/publicKey.validator';

export abstract class AccountTransactionsCommand extends ProfileCommand {
    public readonly transactionCLIService: TransactionCLIService;

    constructor() {
        super();
        this.transactionCLIService = new TransactionCLIService();
    }
}

export class AccountTransactionsOptions extends ProfileOptions {
    @option({
        flag: 'p',
        description: 'Account public key.',
        validator: new PublicKeyValidator(),
    })
    publicKey: string;

    @option({
        flag: 'n',
        description: '(Optional) Number of transactions.',
        default: 10,
    })
    numTransactions: number;

    @option({
        flag: 'i',
        description: '(Optional) Identifier of the transaction after which we want the transactions to be returned.',
    })
    id: string;

    getQueryParams(): QueryParams {
        if (this.id === undefined) {
            return new QueryParams(this.numTransactions);
        }
        return new QueryParams(this.numTransactions, this.id);
    }
}
