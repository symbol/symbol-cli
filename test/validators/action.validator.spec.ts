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

import { ActionValidator, LinkActionValidator, MosaicSupplyChangeActionValidator } from '../../src/validators/action.validator';

describe('Action validator', () => {
    it('default case', () => {
        const value = 'Add';
        expect(new ActionValidator().validate(value)).to.be.equal(true);
    });

    it('should throw error if action is unknown', () => {
        const value = 'TEST';
        expect(typeof new ActionValidator().validate(value)).to.be.equal('string');
    });
});

describe('Link action validator', () => {
    it('default case', () => {
        const value = 'Link';
        expect(new LinkActionValidator().validate(value)).to.be.equal(true);
    });

    it('should throw error if action is unknown', () => {
        const value = 'TEST';
        expect(typeof new LinkActionValidator().validate(value)).to.be.equal('string');
    });
});

describe('Mosaic supply change action validator', () => {
    it('default case', () => {
        const value = 'Increase';
        expect(new MosaicSupplyChangeActionValidator().validate(value)).to.be.equal(true);
    });

    it('should throw error if action is unknown', () => {
        const value = 'TEST';
        expect(typeof new MosaicSupplyChangeActionValidator().validate(value)).to.be.equal('string');
    });
});
