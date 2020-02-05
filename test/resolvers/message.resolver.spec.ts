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
import {expect} from 'chai'
import {MessageResolver} from '../../src/resolvers/message.resolver'
import {RecipientPublicKeyResolver} from '../../src/resolvers/message.resolver'

describe('Message resolver', () => {

    it('should return message', () => {
        const message = '10'
        const profileOptions = {message} as any
        expect(new MessageResolver().resolve(profileOptions))
            .to.be.equal('10')
    })
})

describe('Recipient public key resolver', () => {

    it('should return public account', async () => {
        const recipientPublicKey = '0000000000000000000000000000000000000000000000000000000000000000'
        const profileOptions = {recipientPublicKey} as any
        expect((await new RecipientPublicKeyResolver().resolve(profileOptions)).publicKey)
            .to.be.equal(recipientPublicKey)
    })

    it('should throw error if invalid public key', () => {
        const recipientPublicKey = '00000'
        const profileOptions = {recipientPublicKey} as any
        expect(() => new RecipientPublicKeyResolver().resolve(profileOptions))
            .to.throws(Error)
    })

})
