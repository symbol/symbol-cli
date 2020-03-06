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
import {MosaicFlagsResolver, MosaicIdAliasResolver, MosaicIdResolver, MosaicsResolver} from '../../src/resolvers/mosaic.resolver'
import {expect} from 'chai'
import {NamespaceId} from 'symbol-sdk'

describe('Mosaic id resolver', () => {

    it('should return mosaicId', async () => {
        const mosaicId = '0DC67FBE1CAD29E3'
        const options = {mosaicId} as any
        expect((await new MosaicIdResolver().resolve(options)).toHex())
            .to.be.equal(mosaicId)
    })

})

describe('Mosaic id alias validator', () => {

    it('should return mosaicId', async () => {
        const mosaicId = '0DC67FBE1CAD29E3'
        const options = {mosaicId} as any
        expect((await new MosaicIdAliasResolver().resolve(options)).toHex())
            .to.be.equal(mosaicId)
    })

    it('should return alias', async () => {
        const mosaicId = '@test'
        const options = {mosaicId} as any
        expect(await new MosaicIdAliasResolver().resolve(options))
            .to.be.instanceOf(NamespaceId)
    })

})

describe('Mosaics resolver', () => {

    it('should return array of mosaics', async () => {
        const mosaics = '0DC67FBE1CAD29E3::1,@test::2'
        const options = {mosaics} as any
        const resolution = await new MosaicsResolver().resolve(options)

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
        const options = {transferable, supplyMutable, restrictable} as any
        const resolution = await new MosaicFlagsResolver()
            .resolve(options)

        expect(resolution.transferable).to.be.equal(transferable)
        expect(resolution.supplyMutable).to.be.equal(supplyMutable)
        expect(resolution.restrictable).to.be.equal(restrictable)
    })

})

describe('MosaicIdAliasResolver optional resolver', () => {
    it('should return mosaicId', () => {
        const referenceMosaicId = '0DC67FBE1CAD29E3'
        const options = {referenceMosaicId} as any
        expect(new MosaicIdAliasResolver().optionalResolve(options).toHex())
            .to.be.equal(referenceMosaicId)
    })

    it('should return alias',  () => {
        const referenceMosaicId = '@test'
        const options = {referenceMosaicId} as any
        expect(new MosaicIdAliasResolver().optionalResolve(options))
            .to.be.instanceOf(NamespaceId)
    })

    it('should return default mosaicId',  () => {
        const defaultMosaicId = '0DC67FBE1CAD29E3'
        const referenceMosaicId = undefined
        const options = {referenceMosaicId} as any
        expect(new MosaicIdAliasResolver().optionalResolve(options, 'referenceMosaicId', '0DC67FBE1CAD29E3').toHex())
            .to.be.equal(defaultMosaicId)
    })

})
