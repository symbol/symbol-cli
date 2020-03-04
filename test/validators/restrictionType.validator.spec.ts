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
import {MosaicRestrictionTypeValidator} from '../../src/validators/restrictionType.validator'
import {MosaicRestrictionType} from 'nem2-sdk'

describe('mosaic restriction type validator', () => {
    it('valid mosaic restriction type', () => {
        const mosaic = MosaicRestrictionType.EQ
        expect(new MosaicRestrictionTypeValidator().validate(mosaic))
            .to.be.equal(true)
    })

    it('invalid mosaic restriction type', () => {
        const mosaic = 9999999999999
        expect(
            new MosaicRestrictionTypeValidator().validate(mosaic)
        ).to.be.equal('Invalid mosaic restriction type')
    })
})
