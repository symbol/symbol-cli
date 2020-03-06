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
import {PublicKeysValidator, PublicKeyValidator} from '../../src/validators/publicKey.validator'
import {expect} from 'chai'

describe('Public key validator', () => {

    it('default case', () => {
        const upperCasePublicKey = '58A86B00DEED2CAC9AB62B96BA02B37E079772738DD3B3C6DF400DE796D7C347'
        const lowercasePublicKey = '58a86b00deed2cac9ab62b96ba02b37e079772738dd3b3c6df400de796d7c347'
        expect(new PublicKeyValidator().validate(upperCasePublicKey))
            .to.be.equal(true)
        expect(new PublicKeyValidator().validate(lowercasePublicKey))
            .to.be.equal(true)
    })

    it('should throw error if public key length is not 64', () => {
        const publicKey = '58A86B00DEED2CAC9AB62B96BA02B37E079772738DD3B3C6DF400DE796D7C34'
        expect(
            new PublicKeyValidator().validate(publicKey)
        ).to.be.equal('Public key should be a 64 characters hexadecimal string')
    })

    it('should throw error if public key has a special char', () => {
        const publicKey = '58A86B00DEED2CAC9AB62B96BA02B37E079!72738DD3B3C6DF400DE796D7C34'
        expect(
            new PublicKeyValidator().validate(publicKey)
        ).to.be.equal('Public key should be a 64 characters hexadecimal string')
    })

})

describe('Public keys validator', () => {

    it('should be possible to validate multiple public keys at the same time', () => {
        const publicKeys = '58a86b00deed2cac9ab62b96ba02b37e079772738dd3b3c6df400de796d7c347,' +
            '58a86b00deed2cac9ab62b96ba02b37e079772738dd3b3c6df400de796d7c347,' +
            '58a86b00deed2cac9ab62b96ba02b37e079772738dd3b3c6df400de796d7c347'
        expect(new PublicKeysValidator().validate(publicKeys))
            .to.be.equal(true)
    })

    it('should throw error if one public key is invalid', () => {
        const publicKeys = '58a86b00deed2cac9ab62b96ba02b37e079772738dd3b3c6df400de796d7c347,' +
            '58a86b00deed2cac9ab62b96ba02b37e079772738dd3b3c6df400de796d7c347,' +
            '58a86b00deed2cac9ab62b96ba02b37e079772738dd3b3c6'
        expect(new PublicKeysValidator().validate(publicKeys))
            .to.be.equal('Public key should be a 64 characters hexadecimal string')
    })

})
