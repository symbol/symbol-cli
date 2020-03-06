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
import { MosaicValidator } from '../../src/validators/mosaic.validator'
import { expect } from 'chai'

describe('Mosaic validator', () => {

    it('default case (@aliasName)', () => {
        const mosaic = '@symbol.xym::1000000'
        expect(new MosaicValidator().validate(mosaic))
            .to.be.equal(true)
    })

    it('default case (hex)', () => {
        const mosaic = '85BBEA6CC462B244::1000000'
        expect(new MosaicValidator().validate(mosaic))
            .to.be.equal(true)
    })

    it('should throw error if alias does not start with @ symbol', () => {
        const mosaic = 'cat.currencxy::1000000'
        expect(
            new MosaicValidator().validate(mosaic)
        ).to.be.equal('Mosaic should be in the format (mosaicId(hex)|@aliasName)::absoluteAmount, ' +
            '(Ex: sending 1 symbol.xym, @symbol.xym::1000000)')
    })

    it('should throw error if format is invalid', () => {
        const mosaic = 'cat.currencxy:1000000'
        expect(
            new MosaicValidator().validate(mosaic)
        ).to.be.equal('Mosaic should be in the format (mosaicId(hex)|@aliasName)::absoluteAmount, ' +
            '(Ex: sending 1 symbol.xym, @symbol.xym::1000000)')
    })
})
