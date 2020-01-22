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
import {ExpectedError, ValidationContext, Validator} from 'clime';

/**
 * Numeric string
 */
export class HashValidator implements Validator<string> {

    /**
     * Validates if a string is composed by numbers.
     * @param {string} value - Numeric string.
     * @param {ValidationContext} context
     * @throws {ExpectedError}
     */
    validate(value: string, context?: ValidationContext): void {
      const hashLength = 64;
      const throwError = () => {throw new ExpectedError('The transaction hash is invalid'); };
      if (typeof value !== 'string') {throwError(); }
      if (value.length !== hashLength) {throwError(); }
    }
}
