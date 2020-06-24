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
import { UInt64 } from 'symbol-sdk';

import { Validator } from './validator';

/**
 * Integer validator
 */
export class IntegerValidator implements Validator<number> {
    /**
     * Validates if a number is an integer.
     * @param {number} value - Number.
     * @returns {true | string}
     */
    validate(value: number): boolean | string {
        return Number.isInteger(+value) ? true : 'Number should be an integer';
    }
}

/**
 * Integer string validator
 */
export class IntegerStringValidator implements Validator<string> {
    /**
     * Validates if a string is composed by numbers.
     * @param {string} value - Numeric string.
     * @returns {true | string}
     */
    validate(value: string): boolean | string {
        try {
            UInt64.fromNumericString(value);
        } catch (err) {
            return 'Number should be an integer';
        }
        return true;
    }
}
