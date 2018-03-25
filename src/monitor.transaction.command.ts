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
import {option} from 'clime';
import {Address} from 'nem2-sdk';
import {AddressValidator} from './address.validator';
import {ProfileCommand, ProfileOptions} from './profile.command';
import {TransactionService} from './service/transaction.service';

export abstract class MonitorAddressCommand extends ProfileCommand {
    public readonly transactionService: TransactionService;

    constructor() {
        super();
        this.transactionService = new TransactionService();
    }
}

export class MonitorAddressOptions extends ProfileOptions {
    @option({
        flag: 'a',
        description: 'Address',
        validator: new AddressValidator(),
    })
    address: string;
}
