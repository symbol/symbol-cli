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

import { IntegerStringValidator, IntegerValidator } from '../../src/validators/integer.validator';

describe('Integer validator', () => {
    it('default case', () => {
        const zeroValue = 0;
        const positiveValue = 1;
        const negativeValue = -1;
        expect(new IntegerValidator().validate(zeroValue)).to.be.equal(true);
        expect(new IntegerValidator().validate(positiveValue)).to.be.equal(true);
        expect(new IntegerValidator().validate(negativeValue)).to.be.equal(true);
    });

    it('should throw error if delta is decimal', () => {
        const value = 1.1;
        expect(typeof new IntegerValidator().validate(value)).to.be.equal('string');
    });
});

describe('Integer string validator', () => {
    it('default case', () => {
        const zeroValue = '0';
        const largePositiveValue = '10000000000000000000000000';
        expect(new IntegerStringValidator().validate(zeroValue)).to.be.equal(true);
        expect(new IntegerStringValidator().validate(largePositiveValue)).to.be.equal(true);
    });

    it('should throw error if not a numeric string', () => {
        const value = 'test';
        expect(new IntegerStringValidator().validate(value)).to.be.equal('Number should be an integer');
    });

    it('should throw error if numeric string is negative', () => {
        const value = '-1';
        expect(new IntegerStringValidator().validate(value)).to.be.equal('Number should be an integer');
    });
});
