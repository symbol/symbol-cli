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
import {NamespaceId} from 'symbol-sdk'
import {MosaicFlagsResolver, MosaicIdAliasResolver, MosaicIdResolver, MosaicsResolver} from '../../src/resolvers/mosaic.resolver'

describe('Mosaic id resolver', () => {

    it('should return mosaicId', async () => {
        const mosaicId = '0DC67FBE1CAD29E3'
        const profileOptions = {mosaicId} as any
        expect((await new MosaicIdResolver().resolve(profileOptions)).toHex())
            .to.be.equal(mosaicId)
    })

})

describe('Mosaic id alias validator', () => {

    it('should return mosaicId', async () => {
        const mosaicId = '0DC67FBE1CAD29E3'
        const profileOptions = {mosaicId} as any
        expect((await new MosaicIdAliasResolver().resolve(profileOptions)).toHex())
            .to.be.equal(mosaicId)
    })

    it('should return alias', async() => {
        const mosaicId = '@test'
        const profileOptions = {mosaicId} as any
        expect(await new MosaicIdAliasResolver().resolve(profileOptions))
            .to.be.instanceOf(NamespaceId)
    })

})

describe('Mosaics resolver', () => {

    it('should return array of mosaics', async () => {
        const mosaics = '0DC67FBE1CAD29E3::1,@test::2'
        const profileOptions = {mosaics} as any
        const resolution = await new MosaicsResolver().resolve(profileOptions)

        expect(resolution[0].id.toHex()).to.be.equal('0DC67FBE1CAD29E3')
        expect(resolution[0].amount.compact()).to.be.equal(1)
        expect(resolution[1].id).to.be.instanceOf(NamespaceId)
        expect(resolution[1].amount.compact()).to.be.equal(2)
    })
})

describe('MosaicFlag resolver', () => {

    it('should return mosaic flags', async () => {
        const transferable = true
        const supplyMutable = true
        const restrictable = true
        const profileOptions = {transferable, supplyMutable, restrictable} as any
        const resolution = await new MosaicFlagsResolver().resolve(profileOptions)

        expect(resolution.transferable).to.be.equal(transferable)
        expect(resolution.supplyMutable).to.be.equal(supplyMutable)
        expect(resolution.restrictable).to.be.equal(restrictable)
    })

})

describe('MosaicIdAliasResolver optional resolver', () => {
    it('should return mosaicId', async () => {
        const referenceMosaicId = '0DC67FBE1CAD29E3'
        const profileOptions = {referenceMosaicId} as any
        expect(await new MosaicIdAliasResolver().optionalResolve(profileOptions).toHex())
            .to.be.equal(referenceMosaicId)
    })

    it('should return alias', async () => {
        const referenceMosaicId = '@test'
        const profileOptions = {referenceMosaicId} as any
        expect(await new MosaicIdAliasResolver().optionalResolve(profileOptions))
            .to.be.instanceOf(NamespaceId)
    })

    it('should return default mosaicId', async() => {
        const defaultMosaicId = '0DC67FBE1CAD29E3'
        const referenceMosaicId = undefined
        const profileOptions = {referenceMosaicId} as any
        expect(await new MosaicIdAliasResolver().optionalResolve(profileOptions, 'referenceMosaicId', '0DC67FBE1CAD29E3').toHex())
            .to.be.equal(defaultMosaicId)
    })

})
