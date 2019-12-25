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
import {NumericStringValidator} from '../../src/validators/numericString.validator';

describe('numeric string validator', () => {

    it('Valid numeric string (0)', () => {
        const value = '0';
        expect(new NumericStringValidator().validate(value, {name: 'value', source: value}))
            .to.be.equal(undefined);
    });

    it('Valid numeric string (large positive number)', () => {
        const value = '10000000000000000000000000';
        expect(new NumericStringValidator().validate(value, {name: 'value', source: value}))
            .to.be.equal(undefined);
    });

    it('Invalid numeric string (string)', () => {
        const value = 'test';
        expect(() => {
            new NumericStringValidator().validate(value, {name: 'value', source: value});
        }).to.throws('Enter a number.');
    });

    it('Invalid numeric string (negative)', () => {
        const value = '-1';
        expect(() => {
            new NumericStringValidator().validate(value, {name: 'value', source: value});
        }).to.throws('Enter a number.');
    });

});
