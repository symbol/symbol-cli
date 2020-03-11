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
import {expect} from 'chai'
import {DeltaValidator} from '../../src/validators/delta.validator'

describe('Delta validator', () => {

    it('default case', () => {
        const zeroValue = 0
        const positiveValue = 1
        const negativeValue = -1
        expect(new DeltaValidator().validate(zeroValue))
            .to.be.equal(true)
        expect(new DeltaValidator().validate(positiveValue))
            .to.be.equal(true)
        expect(new DeltaValidator().validate(negativeValue))
    })

    it('should throw error if delta is decimal', () => {
        const value = 1.1
        expect(
            new DeltaValidator().validate(value)
        ).to.be.equal('Delta value should be an integer')
    })

})
