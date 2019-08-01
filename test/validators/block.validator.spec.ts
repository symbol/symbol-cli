/*
 *
 * Copyright 2018 NEM
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
import {HeightValidator} from '../../src/validators/block.validator';

describe('block height validator', () => {

    it('Invalid valid height', () => {
        const height = 1;
        expect(new HeightValidator().validate(height, {name: 'height', source: height.toString()}))
            .to.be.equal(undefined);
    });

    it('Invalid height is not valid (0)', () => {
        const height = 0;
        expect(() => {
            new HeightValidator().validate(height, {name: 'height', source: height.toString()});
        }).to.throws('The block height cannot be smaller than 1');
    });

    it('Invalid height is not valid (negative)', () => {
        const height = -1;
        expect(() => {
            new HeightValidator().validate(height, {name: 'height', source: height.toString()});
        }).to.throws('The block height cannot be smaller than 1');
    });

    it('Invalid height is not valid (decimal)', () => {
        const height = 1.3;
        expect(() => {
            new HeightValidator().validate(height, {name: 'height', source: height.toString()});
        }).to.throws('The block height cannot be smaller than 1');
    });
});
