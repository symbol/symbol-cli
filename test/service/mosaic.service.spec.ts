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
import {expect} from 'chai';
import {Address, MosaicId, NamespaceId, UInt64} from 'nem2-sdk';
import {MosaicService} from '../../src/service/mosaic.service';

describe('Mosaic service', () => {

    it('getMosaicId should return an alias', () => {
        const rawMosaicId = '@foo';
        expect(MosaicService.getMosaicId(rawMosaicId)).to.be.instanceOf(NamespaceId);
    });

    it('getMosaicId (hex) should return a MosaicId', () => {
        const rawMosaicId = '175785202c44e5db';
        expect(MosaicService.getMosaicId(rawMosaicId)).to.be.instanceOf(MosaicId);
    });

    it('getMosaics should return an array of mosaics', () => {
        const rawMosaics = '175785202c44e5db::1,@foo2::2';
        const mosaics = MosaicService.getMosaics(rawMosaics);
        expect(mosaics.length).to.be.equal(2);
        expect(mosaics[0].id.toHex()).to.be.equal('175785202c44e5db'.toUpperCase());
        expect(mosaics[0].amount.toHex()).to.be.equal(UInt64.fromUint(1).toHex());
        expect(mosaics[1].id.toHex()).to.be.equal(new NamespaceId('foo2').toHex());
        expect(mosaics[1].amount.toHex()).to.be.equal(UInt64.fromUint(2).toHex());
    });

    it('getRecipient should return an alias', () => {
        const rawRecipient = '@foo';
        expect(MosaicService.getRecipient(rawRecipient)).to.be.instanceOf(NamespaceId);
    });

    it('getRecipient should return an address', () => {
        const rawRecipient = 'SDSMQK-MKCAE3-LHGKTD-NE7NYJ-OYEFDK-LAWAKW-KRAM';
        expect(MosaicService.getRecipient(rawRecipient)).to.be.instanceOf(Address);
    });

    it('validate should not throw exception (alias)', () => {
        const string = '@foo::1';
        expect(MosaicService.validate(string)).to.be.equal(undefined);
    });

    it('validate should not throw exception (hex)', () => {
        const string = '175785202c44e5db::1';
        expect(MosaicService.validate(string)).to.be.equal(undefined);
    });

    it('validate should throw exception', () => {
        const string = 'a::1';
        expect(() => { MosaicService.validate(string); } ).to.throws(
            'Mosaic should be in the format (mosaicId(hex)|@aliasName)::absoluteAmount,' +
            ' (Ex: sending 1 cat.currency, @cat.currency::1000000)');
    });

    it('validate should throw exception (format)', () => {
        const string = 'a::1';
        expect(() => { MosaicService.validate(string); } ).to.throws(
            'Mosaic should be in the format (mosaicId(hex)|@aliasName)::absoluteAmount,' +
            ' (Ex: sending 1 cat.currency, @cat.currency::1000000)');
    });

});
