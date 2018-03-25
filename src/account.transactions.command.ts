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
import {ExpectedError, option, ValidationContext, Validator} from 'clime';
import {QueryParams} from 'nem2-sdk';
import {TransactionService} from './service/transaction.service';
import {ProfileCommand, ProfileOptions} from './profile.command';

export class PublicKeyValidator implements Validator<string> {
    validate(value: string, context: ValidationContext): void {
        if (value.length !== 64 || !/^[0-9a-fA-F]+$/.test(value)) {
            throw new ExpectedError('public key should be a 64 characters hexadecimal string');
        }
    }
}

export abstract class AccountTransactionsCommand extends ProfileCommand {
    public readonly transactionService: TransactionService;

    constructor() {
        super();
        this.transactionService = new TransactionService();
    }
}

export class AccountTransactionsOptions extends ProfileOptions {
    @option({
        flag: 'p',
        description: 'Account public key',
        validator: new PublicKeyValidator(),
    })
    publickey: string;

    @option({
        flag: 'n',
        description: '(optional) Number of transactions',
        default: 10,
    })
    numtransactions: number;

    @option({
        flag: 'i',
        description: '(optional) Identifier of the transaction after which we want the transactions to be returned',
    })
    id: string;

    getQueryParams(): QueryParams {
        if (this.id === undefined) {
            return new QueryParams(this.numtransactions);
        }
        return new QueryParams(this.numtransactions, this.id);
    }
}