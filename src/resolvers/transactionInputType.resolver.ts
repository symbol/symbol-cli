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
import { OptionsChoiceResolver } from '../options-resolver';
import { Resolver } from './resolver';

export enum TransactionInputType {
    HASH = 'HASH',
    PAYLOAD = 'PAYLOAD',
}
/**
 * Transaction input type resolver
 */
export class TransactionInputTypeResolver implements Resolver {
    /**
     * Resolves tx hash|payload selection provided by the user.
     * @param {Options} options - Command options.
     * @param {string} altText - Alternative text.
     * @param {string} altKey - Alternative key.
     * @returns {Promise<number>}
     */
    async resolve(options: Options, altText?: string, altKey?: string): Promise<TransactionInputType> {
        const choices = [
            { title: 'transaction hash', value: TransactionInputType.HASH },
            { title: 'transaction payload(for off-chain tx)', value: TransactionInputType.PAYLOAD },
        ];

        return await OptionsChoiceResolver(
            options,
            altKey ? altKey : 'transactionInputType',
            altText ? altText : 'Choose a transaction input type:',
            choices,
            'select',
            undefined, // TODO new TransactionInputTypeValidator
        );
    }
}
