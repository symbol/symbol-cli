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
import {Options} from 'clime'
import {TransactionType} from 'symbol-sdk'

import {OptionsChoiceResolver} from '../options-resolver'
import {Resolver} from './resolver'
import {TransactionTypeValidator} from '../validators/transactionType.validator'

/**
 * Transaction type resolver
 */
export class TransactionTypeResolver implements Resolver {

    /**
     * Resolves a transaction type provided by the user.
     * @param {Options} options - Command options.
     * @param {string} altText - Alternative text.
     * @param {string} altKey - Alternative key.
     * @returns {Promise<number>}
     */
    async resolve(options: Options, altText?: string, altKey?: string): Promise<number> {
        const choices = Object
            .keys(TransactionType)
            .filter((key) => Number.isNaN(parseFloat(key)) && key !== 'RESERVED')
            .map((string) => ({
                title:  string,
                value: `${TransactionType[string as any]}`,
            }))

        const value = +(await OptionsChoiceResolver(options,
            altKey ? altKey : 'transactionType',
            altText ? altText : 'Chose a transaction type:',
            choices,
            'select',
            new TransactionTypeValidator()))
        return value
    }
}
