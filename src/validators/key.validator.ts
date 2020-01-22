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
import { ExpectedError, ValidationContext, Validator } from 'clime';
import { UInt64 } from 'nem2-sdk';

/**
 * Key validator
 */
export class KeyValidator implements Validator<string> {
    /**
     * validates if the key is valid.
     * @param {string} value - the key.
     * @param {ValidationContext} context
     * @throws {ExpectedError}
     */
    validate(value: string, context?: ValidationContext): void {
        try {
            UInt64.fromHex(value);
        } catch (err) {
            throw new ExpectedError('Invalid key');
        }
    }
}
