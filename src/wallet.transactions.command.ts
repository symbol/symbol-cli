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
import {Spinner} from 'cli-spinner';
import {Command, ExpectedError, option, Options} from 'clime';
import {QueryParams} from 'nem2-sdk';
import {Wallet} from './model/wallet';
import {WalletRepository} from './respository/wallet.repository';
import {TransactionService} from './service/transaction.service';
import {WalletService} from './service/wallet.service';
import {WalletCommand, WalletOptions} from './wallet.command';

export class WalletTransactionOptions extends WalletOptions {
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

export abstract class WalletTransactionCommand extends WalletCommand {
    public readonly transactionService: TransactionService;

    constructor() {
        super();
        this.transactionService = new TransactionService();
    }
}
