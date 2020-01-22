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
import {TransactionService} from '../services/transaction.service';
import {ProfileCommand, ProfileOptions} from './profile.command';

/**
 * Base command class to listen the blockchain.
 */
export abstract class MonitorAddressCommand extends ProfileCommand {
    protected readonly transactionService: TransactionService;

    /**
     * Constructor.
     */
    protected constructor() {
        super();
        this.transactionService = new TransactionService();
    }
}

/**
 * Monitor address options.
 */
export class MonitorAddressOptions extends ProfileOptions {
    @option({
        flag: 'a',
        description: 'Account address.',
    })
    address: string;
}
