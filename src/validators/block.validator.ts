/*
 *
 * Copyright 2018-present NEM
 *
 * Licensed under the Apache License, Version 2.0 (the "License")
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
import {ExpectedError, ValidationContext, Validator} from 'clime'
import {UInt64} from 'nem2-sdk'

/**
 * Height validator
 */
export class HeightValidator implements Validator<string> {

    /**
     * Validates if height value is bigger than 0.
     * @param {string} value - Height.
     * @param {ValidationContext} context
     * @throws {ExpectedError}
     */
    validate(value: string, context?: ValidationContext): void {
        let valid = true
        if (value === '0') {
            valid = false
        }
        try {
            UInt64.fromNumericString(value)
        } catch (e) {
            valid = false
        }
        if (!valid) {
            throw new ExpectedError('The block height must be a positive integer')
        }
    }
}
