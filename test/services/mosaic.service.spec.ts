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
import {MosaicService} from '../../src/services/mosaic.service'
import {expect} from 'chai'
import {MosaicId, NamespaceId, UInt64} from 'symbol-sdk'

describe('Mosaic service', () => {

    it('should create mosaic service', () => {
        expect(new MosaicService()).to.not.be.equal(undefined)
    })

    it('getMosaicId should return an alias', () => {
        const rawMosaicId = '@foo'
        expect(MosaicService.getMosaicId(rawMosaicId)).to.be.instanceOf(NamespaceId)
    })

    it('getMosaicId (hex) should return a MosaicId', () => {
        const rawMosaicId = '175785202c44e5db'
        expect(MosaicService.getMosaicId(rawMosaicId)).to.be.instanceOf(MosaicId)
    })

    it('getMosaics should return an array of mosaics', () => {
        const rawMosaics = '175785202c44e5db::1,@foo2::2'
        const mosaics = MosaicService.getMosaics(rawMosaics)
        expect(mosaics.length).to.be.equal(2)
        expect(mosaics[0].id.toHex()).to.be.equal('175785202c44e5db'.toUpperCase())
        expect(mosaics[0].amount.toHex()).to.be.equal(UInt64.fromUint(1).toHex())
        expect(mosaics[1].id.toHex()).to.be.equal(new NamespaceId('foo2').toHex())
        expect(mosaics[1].amount.toHex()).to.be.equal(UInt64.fromUint(2).toHex())
    })

    it('validate should not throw exception (alias)', () => {
        const string = '@foo::1'
        expect(MosaicService.validate(string)).to.be.equal(true)
    })

    it('validate should not throw exception (hex)', () => {
        const string = '175785202c44e5db::1'
        expect(MosaicService.validate(string)).to.be.equal(true)
    })

    it('validate should throw exception', () => {
        const string = 'a::1'
        expect(MosaicService.validate(string)).to.equal(
            'Mosaic should be in the format (mosaicId(hex)|@aliasName)::absoluteAmount,' +
            ' (Ex: sending 1 symbol.xym, @symbol.xym::1000000)')
    })

    it('validate should throw exception (format)', () => {
        const string = 'a::1'
        expect(MosaicService.validate(string)).to.equal(
            'Mosaic should be in the format (mosaicId(hex)|@aliasName)::absoluteAmount,' +
            ' (Ex: sending 1 symbol.xym, @symbol.xym::1000000)')
    })

})
