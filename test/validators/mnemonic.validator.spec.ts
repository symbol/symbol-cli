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
import { MnemonicValidator } from '../../src/validators/mnemonic.validator';

const mnemonic =
    'uniform promote eyebrow frequent mother order evolve spell elite lady clarify accuse annual tenant rotate walnut wisdom render before million scrub scan crush sense';

describe('Mnemonic validator', () => {
    it('default case ', () => {
        expect(new MnemonicValidator().validate(mnemonic)).to.be.equal(true);
    });

    it('should throw error if mnemonic is invalid', () => {
        expect(typeof new MnemonicValidator().validate('invalid mnemonic')).to.be.equal('string');
    });
});
