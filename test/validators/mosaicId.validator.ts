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
import {MosaicIdAliasValidator, MosaicIdValidator} from '../../src/validators/mosaicId.validator';

describe('mosaic id validator', () => {

    it('Valid mosaic id ', () => {
        const value = '941299B2B7E1291C';
        expect(new MosaicIdValidator().validate(value, {name: 'value', source: value}))
            .to.be.equal(undefined);
    });

    it('Invalid mosaic id (string)', () => {
        const value = 'test';
        expect(() => {
            new MosaicIdValidator().validate(value, {name: 'value', source: value});
        }).to.throws('Introduce a mosaic id in hexadecimal format. Example: 941299B2B7E1291C');
    });

});

describe('mosaic alias validator', () => {
    it('Valid mosaic id', () => {
        const mosaicId = '941299B2B7E1291C';
        expect(new MosaicIdAliasValidator().validate(mosaicId, {name: 'mosaicId', source: mosaicId}))
            .to.be.equal(undefined);
    });

    it('Invalid mosaic id (string)', () => {
        const value = 'test';
        expect(() => {
            new MosaicIdAliasValidator().validate(value, {name: 'value', source: value});
        }).to.throws('Introduce a mosaic id in hexadecimal format. Example: 941299B2B7E1291C');
    });

    it('Valid mosaic alias', () => {
        const alias = '@nem.xem';
        expect(new MosaicIdAliasValidator().validate(alias, {name: 'alias', source: alias}))
            .to.be.equal(undefined);
    });

    it('Invalid mosaic alias', () => {
        const value = '@myOwnAlias.name';
        expect(() => {
            new MosaicIdAliasValidator().validate(value, {name: 'value', source: value});
        }).to.throws('Introduce valid mosaic alias. Example: @nem.xem');
    });
});
