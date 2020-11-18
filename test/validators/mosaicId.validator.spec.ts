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

import { expect } from 'chai';
import { MosaicIdAliasValidator, MosaicIdValidator } from '../../src/validators/mosaicId.validator';

describe('Mosaic id validator', () => {
    it('default case', () => {
        const value = '941299B2B7E1291C';
        expect(new MosaicIdValidator().validate(value)).to.be.equal(true);
    });

    it('should throw error if mosaicId is not valid', () => {
        const value = 'test';
        expect(typeof new MosaicIdValidator().validate(value)).to.be.equal('string');
    });
});

describe('mosaic alias validator', () => {
    it('default case', () => {
        const mosaicId = '941299B2B7E1291C';
        expect(new MosaicIdAliasValidator().validate(mosaicId)).to.be.equal(true);
    });

    it('should throw error if mosaicId is not valid', () => {
        const value = 'test';
        expect(typeof new MosaicIdValidator().validate(value)).to.be.equal('string');
    });

    it('should throw error if alias is not valid (special char)', () => {
        const alias = '@nem.xem';
        expect(new MosaicIdAliasValidator().validate(alias)).to.be.equal(true);
    });

    it('should throw error if mosaicId is not valid (uppercase)', () => {
        const value = '@myOwnAlias.name';
        expect(typeof new MosaicIdValidator().validate(value)).to.be.equal('string');
    });
});
