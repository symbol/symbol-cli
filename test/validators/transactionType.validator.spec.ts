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
import {TransactionTypeValidator} from '../../src/validators/transactionType.validator'
import {expect} from 'chai'

describe('Transaction type validator', () => {

    it('default case', () => {
        const value = 'TRANSFER'
        expect(new TransactionTypeValidator().validate(value))
            .to.be.equal(true)
    })

    it('should throw error if transaction is unknown', () => {
        const value = 'wrong_value'
        expect(
            new TransactionTypeValidator().validate(value)
        ).to.be.equal('The provided transaction type is invalid')
    })

})
