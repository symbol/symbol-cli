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
import { MosaicsValidator, MosaicValidator } from '../../src/validators/mosaic.validator';

describe('Mosaic validator', () => {
    it('default case (@aliasName)', () => {
        const mosaic = '@symbol.xym::1000000';
        expect(new MosaicValidator().validate(mosaic)).to.be.equal(true);
    });

    it('default case (hex)', () => {
        const mosaic = '85BBEA6CC462B244::1000000';
        expect(new MosaicValidator().validate(mosaic)).to.be.equal(true);
    });

    it('should throw error if alias does not start with @ symbol', () => {
        const mosaic = 'cat.currencxy::1000000';
        expect(typeof new MosaicValidator().validate(mosaic)).to.be.equal('string');
    });

    it('should throw error if format is invalid', () => {
        const mosaic = 'cat.currencxy:1000000';
        expect(typeof new MosaicValidator().validate(mosaic)).to.be.equal('string');
    });
});

describe('Mosaics validator', () => {
    it('default case (empty)', () => {
        const mosaic = '';
        expect(new MosaicsValidator().validate(mosaic)).to.be.equal(true);
    });

    it('one mosaic', () => {
        const mosaic = '@symbol.xym::1000000';
        expect(new MosaicsValidator().validate(mosaic)).to.be.equal(true);
    });

    it('N mosaics', () => {
        const mosaic = '85BBEA6CC462B244::1000000,@symbol.xym::1000000';
        expect(new MosaicsValidator().validate(mosaic)).to.be.equal(true);
    });

    it('should throw error if format is invalid', () => {
        const mosaic = 'cat.currency:1000000';
        expect(typeof new MosaicValidator().validate(mosaic)).to.be.equal('string');
    });
});
