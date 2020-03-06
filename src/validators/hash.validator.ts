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
import {Validator} from './validator'

/**
 * Numeric string
 */
export class HashValidator implements Validator<string> {

    /**
     * Validates if a string is a valid hash.
     * @param {string} value     * @returns {true | string}
     */
    validate(value: string): boolean | string {
      const hashLength = 64
      return (typeof value !== 'string' || value.length !== hashLength) ?  'The transaction hash is invalid' : true
    }
}
