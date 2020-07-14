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

import { OptionsResolver } from '../options-resolver';
import { MnemonicValidator } from '../validators/mnemonic.validator';
import { Resolver } from './resolver';

/**
 * Mnemonic passphrase resolver
 */
export class MnemonicResolver implements Resolver {
    /**
     * Resolves a mnemonic passphrase provided by the user.
     * @returns {Promise<string>}
     */
    async resolve(options: Options): Promise<string> {
        return OptionsResolver(
            options,
            'mnemonic',
            () => undefined,
            'Enter a mnemonic passphrase. Words must be separated by spaces:',
            'password',
            new MnemonicValidator(),
        );
    }
}
