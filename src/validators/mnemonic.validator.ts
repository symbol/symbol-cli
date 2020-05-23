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
import { MnemonicPassPhrase } from 'symbol-hd-wallets';

import { Validator } from './validator';

/**
 * Mnemonic passphrase validator
 */
export class MnemonicValidator implements Validator<string> {
    /**
     * Validates a mnemonic passphrase.
     * @param {string} value - Mnemonic passphrase.
     * @returns {true | string}
     */
    validate(value: string): boolean | string {
        return new MnemonicPassPhrase(value).isValid() || 'The provided mnemonic passphrase is invalid';
    }
}
