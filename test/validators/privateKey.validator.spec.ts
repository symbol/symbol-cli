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
import {PrivateKeyValidator} from '../../src/validators/privateKey.validator'
import {expect} from 'chai'

describe('Private key validator', () => {

    it('default case ', () => {
        const upperCasePrivateKey = '0'.repeat(63) + 'A'
        const lowerCasePrivateKey = '0'.repeat(63) + 'a'
        expect(new PrivateKeyValidator().validate(upperCasePrivateKey))
            .to.be.equal(true)
        expect(new PrivateKeyValidator().validate(lowerCasePrivateKey))
            .to.be.equal(true)
    })

    it('should throw error if private key length is not 64', () => {
        const privateKey = '0'.repeat(63)
        expect(
            new PrivateKeyValidator().validate(privateKey)
        ).to.be.equal('Private key should be a 64 characters hexadecimal string')
    })

    it('should throw error if private key has special chars', () => {
        const privateKey = '0'.repeat(63) + '!'
        expect(
            new PrivateKeyValidator().validate(privateKey)
        ).to.be.equal('Private key should be a 64 characters hexadecimal string')
    })

})
