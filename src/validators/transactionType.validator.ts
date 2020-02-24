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
import {ExpectedError, ValidationContext, Validator} from 'clime'
import {TransactionType} from 'symbol-sdk'

/**
 * Transaction type validator
 */
export class TransactionTypeValidator implements Validator<string> {

    /*
     * Validates if transaction type is known.
     * @param {string} value - Transaction type.
     * @param {ValidationContext} context
     * @throws {ExpectedError}
     */
    validate(value: string, context?: ValidationContext): void {
        let success = true
        try {
            const h = parseInt(value, 16)
            if (h.toString(16) !== value.toLowerCase()) {
                success = false
            } else if (!(h in TransactionType)) {
                success = false
            }
        } catch (err) {
            success = false
        }
        if (!success) {
            throw new ExpectedError('Enter a transaction type in hexadecimal. Example: 4154')
        }
    }
}
