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
import { NetworkType } from 'symbol-sdk';
import { OptionsChoiceResolver } from '../options-resolver';
import { NetworkValidator } from '../validators/network.validator';
import { Resolver } from './resolver';

/**
 * Restriction account address flags resolver
 */
export class NetworkResolver implements Resolver {
    /**
     * Resolves a network type provided by the user.
     * @param {Options} options - Command options.
     * @param {string} altText - Alternative text.
     * @param {string} altKey - Alternative key.
     * @returns {Promise<any>}
     */
    async resolve(options: Options, altText?: string, altKey?: string): Promise<any> {
        const choices = [
            { title: 'MAIN_NET', value: NetworkType.MAIN_NET },
            { title: 'TEST_NET', value: NetworkType.TEST_NET },
            { title: 'PRIVATE', value: NetworkType.PRIVATE },
            { title: 'PRIVATE_TEST', value: NetworkType.PRIVATE_TEST },
            { title: 'MIJIN', value: NetworkType.MIJIN },
            { title: 'MIJIN_TEST', value: NetworkType.MIJIN_TEST },
        ];
        const value = +(await OptionsChoiceResolver(
            options,
            altKey ? altKey : 'network',
            altText ? altText : 'Select the network type:',
            choices,
            'select',
            new NetworkValidator(),
        ));
        return value;
    }
}
