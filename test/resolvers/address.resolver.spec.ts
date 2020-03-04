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
import {Address, NamespaceId} from 'symbol-sdk'
import {AddressAliasResolver, AddressResolver} from '../../src/resolvers/address.resolver'

describe('Address resolver', () => {

    it('should return address', async () => {
        const address = 'SB3KUBHATFCPV7UZQLWAQ2EUR6SIHBSBEOEDDDF3'
        const profileOptions = {address} as any
        expect((await new AddressResolver().resolve(profileOptions)).plain())
            .to.be.equal(address)
    })

})

describe('Recipient address alias resolver', () => {

    it('should return alias', async() => {
        const recipientAddress = '@alias'
        const profileOptions = {recipientAddress} as any
        expect(await new AddressAliasResolver().resolve(profileOptions, undefined, undefined, 'recipientAddress'))
            .to.be.instanceOf(NamespaceId)
    })

    it('should return address', async () => {
        const recipientAddress = 'SB3KUBHATFCPV7UZQLWAQ2EUR6SIHBSBEOEDDDF3'
        const profileOptions = {recipientAddress} as any
        const address = await new AddressAliasResolver().resolve(profileOptions, undefined, undefined, 'recipientAddress')
        expect(address).instanceof(Address)
        expect((address as Address).plain())
            .to.be.equal(recipientAddress)
    })
    
})
