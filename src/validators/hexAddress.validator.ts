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
import { Address } from 'symbol-sdk';
import { Validator } from './validator';

/**
 * Hex Address validator
 */
export class HexAddressValidator implements Validator<string> {
    /**
     * Validates if an address object can be created from a string.
     * @param {string} value - Raw address.
     * @returns {true | string}
     */
    validate(value: string): boolean | string {
        try {
            Address.createFromEncoded(value);
        } catch (err) {
            return 'Enter a valid hex address. Example: 9826D27E1D0A26CA4E316F901E23E55C8711DB20DFD26776';
        }
        return true;
    }
}
