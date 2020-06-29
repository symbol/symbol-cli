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
import { Options } from 'clime';
import { TransactionGroup } from 'symbol-sdk';

import { OptionsChoiceResolver } from '../options-resolver';
import { TransactionGroupValidator } from '../validators/transactionGroup.validator';
import { Resolver } from './resolver';

/**
 * Transaction group resolver
 */
export class TransactionGroupResolver implements Resolver {
    /**
     * Resolves a transaction group provided by the user.
     * @param {Options} options - Command options.
     * @param {string} altText - Alternative text.
     * @param {string} altKey - Alternative key.
     * @returns {Promise<TransactionGroup>}
     */
    async resolve(options: Options, altText?: string, altKey?: string): Promise<TransactionGroup> {
        const choices = [
            {
                title: 'Confirmed',
                value: TransactionGroup.Confirmed,
            },
            {
                title: 'Unconfirmed',
                value: TransactionGroup.Unconfirmed,
            },
            {
                title: 'Partial',
                value: TransactionGroup.Partial,
            },
        ];

        return await OptionsChoiceResolver(
            options,
            altKey ? altKey : 'group',
            altText ? altText : 'Select a group:',
            choices,
            'select',
            new TransactionGroupValidator(),
        );
    }
}
