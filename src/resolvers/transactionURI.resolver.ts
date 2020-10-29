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
import { Transaction, TransactionMapping } from 'symbol-sdk';
import { TransactionURI } from 'symbol-uri-scheme';

import { Profile } from '../models/profile.model';
import { OptionsResolver } from '../options-resolver';
import { TransactionURIValidator } from '../validators/transactionURI.validator';
import { Resolver } from './resolver';

/**
 * TransactionURI resolver
 */
export class TransactionURIResolver implements Resolver {
    /**
     * Resolves a Transaction URI provided by the user.
     * @param {Options} options - Command options.
     * @param {Profile} secondSource - Secondary data source.
     * @param {string} altText - Alternative text.
     * @param {string} altKey - Alternative key.
     * @returns {Promise<string>}
     */
    async resolve(options: Options, secondSource?: Profile, altText?: string, altKey?: string): Promise<TransactionURI<Transaction>> {
        const resolution = await OptionsResolver(
            options,
            altKey ? altKey : 'uri',
            () => (secondSource ? secondSource.url : undefined),
            altText ? altText : 'Enter the Transaction URI:',
            'text',
            new TransactionURIValidator(),
        );
        return TransactionURI.fromURI(resolution, TransactionMapping.createFromPayload);
    }
}
