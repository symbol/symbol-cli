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
import { UInt64 } from 'symbol-sdk';

import { OptionsResolver } from '../options-resolver';
import { KeyValidator } from '../validators/key.validator';
import { Resolver } from './resolver';

export class KeyResolver implements Resolver {
    /**
     * Resolves a string key provided by user.
     * @param {Options} options - Command options.
     * @param {string} altText - Alternative text.
     * @param {string} altKey - Alternative key.
     * @returns {Promise<UInt64>}
     */
    async resolve(options: Options, altText?: string, altKey?: string): Promise<UInt64> {
        const resolution = await OptionsResolver(
            options,
            altKey ? altKey : 'key',
            () => undefined,
            altText
                ? altText
                : 'Enter a UInt64 key in hexadecimal format.' +
                      " You can use the command 'symbol-cli converter stringToKey' " +
                      'to turn a string into a valid key:',
            'text',
            new KeyValidator(),
        );
        return UInt64.fromHex(resolution);
    }
}
