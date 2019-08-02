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
import {MaxFeeValidator} from '../../src/validators/maxfee.validator';

describe('Maximum fee validator', () => {

    it('Valid maximum fee', () => {
        const maxFee = 123;
        expect(new MaxFeeValidator().validate(maxFee, {name: 'maxFee', source: maxFee.toString()}))
            .to.be.equal(undefined);
    });

    it('Valid maximum fee (negative)', () => {
        const maxFee = -1;
        expect(() => {
            new MaxFeeValidator().validate(maxFee, {name: 'maxFee', source: maxFee.toString()});
        }).to.throws('maxFee should be positive integer or equal to 0');
    });

    it('Invalid maximum fee(decimal)', () => {
        const maxFee = 0.33;
        expect(() => {
            new MaxFeeValidator().validate(maxFee, {name: 'maxFee', source: maxFee.toString()});
        }).to.throws('maxFee should be positive integer or equal to 0');
    });
});
