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
import {HeightValidator} from '../../src/validators/block.validator'
import {expect} from 'chai'

describe('block height validator', () => {

    it('default case', () => {
        const height = '1'
        expect(new HeightValidator().validate(height))
            .to.be.equal(true)
    })

    it('should throw error if height is 0', () => {
        const height = '0'
        expect(
            new HeightValidator().validate(height)
        ).to.be.equal('The block height must be a positive integer')
    })

    it('should throw error if height is negative', () => {
        const height = '-1'
        expect(
            new HeightValidator().validate(height)
        ).to.be.equal('The block height must be a positive integer')
    })

    it('should throw error if height is decimal', () => {
        const height = '1.3'
        expect(
            new HeightValidator().validate(height)
        ).to.be.equal('The block height must be a positive integer')
    })
})
