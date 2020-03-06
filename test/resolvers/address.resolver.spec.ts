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
import {AddressAliasResolver, AddressResolver} from '../../src/resolvers/address.resolver'
import {expect} from 'chai'
import {Address, NamespaceId} from 'symbol-sdk'

describe('Address resolver', () => {

    it('should return address', async () => {
        const address = 'SB3KUBHATFCPV7UZQLWAQ2EUR6SIHBSBEOEDDDF3'
        const options = {address} as any
        expect((await new AddressResolver().resolve(options)).plain())
            .to.be.equal(address)
    })

    it('should change key', async () => {
        const key = 'SB3KUBHATFCPV7UZQLWAQ2EUR6SIHBSBEOEDDDF3'
        const options = {key} as any
        expect((await new AddressResolver()
            .resolve(options, undefined, 'altText', 'key')).plain())
            .to.be.equal(key)
    })


})

describe('Recipient address alias resolver', () => {

    it('should return alias', async () => {
        const address = '@alias'
        const options = {address} as any
        expect(await new AddressAliasResolver().resolve(options))
            .to.be.instanceOf(NamespaceId)
    })

    it('should return address', async () => {
        const address = 'SB3KUBHATFCPV7UZQLWAQ2EUR6SIHBSBEOEDDDF3'
        const options = {address} as any
        const resolvedAddress = await new AddressAliasResolver().resolve(options)
        expect(resolvedAddress).instanceof(Address)
        expect((resolvedAddress as Address).plain())
            .to.be.equal(address)
    })

    it('should change key', async () => {
        const key = '@alias'
        const options = {key} as any
        expect(await new AddressAliasResolver()
            .resolve(options, undefined, 'altText', 'key'))
            .to.be.instanceOf(NamespaceId)
    })


})
