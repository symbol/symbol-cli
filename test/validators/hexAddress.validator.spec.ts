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
import { HexAddressValidator } from '../../src/validators/hexAddress.validator';

describe('Hex address validator', () => {
    it('default case', () => {
        const value = '9826D27E1D0A26CA4E316F901E23E55C8711DB20DFD26776';
        expect(new HexAddressValidator().validate(value)).to.be.equal(true);
    });

    it('should throw error if hex address is unknown', () => {
        const value = 'wrong_address';
        expect(typeof new HexAddressValidator().validate(value)).to.be.equal('string');
    });
});
