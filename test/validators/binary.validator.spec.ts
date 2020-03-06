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
import {BinaryValidator} from '../../src/validators/binary.validator'
import {expect} from 'chai'

describe('binary validator', () => {

    it('default case', () => {
        const positiveValue = 1
        const zeroValue = 0
        expect(new BinaryValidator().validate(positiveValue))
            .to.be.equal(true)
        expect(new BinaryValidator().validate(zeroValue))
            .to.be.equal(true)
    })

    it('should throw error if value is negative', () => {
        const value = -1
        expect(
            new BinaryValidator().validate(value)
        ).to.be.equal('The value must be 0 or 1')
    })

    it('should throw error if value is decimal', () => {
        const value = 1.1
        expect(
            new BinaryValidator().validate(value)
        ).to.be.equal('The value must be 0 or 1')
    })
})
