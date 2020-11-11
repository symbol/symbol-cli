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
import { DerivationService } from '../../src/services/derivation.service';

const paths = [
    "m/44'/4343'/0'/0'/0'",
    "m/44'/4343'/1'/0'/0'",
    "m/44'/4343'/2'/0'/0'",
    "m/44'/4343'/3'/0'/0'",
    "m/44'/4343'/4'/0'/0'",
    "m/44'/4343'/5'/0'/0'",
    "m/44'/4343'/6'/0'/0'",
    "m/44'/4343'/7'/0'/0'",
    "m/44'/4343'/8'/0'/0'",
    "m/44'/4343'/9'/0'/0'",
];

describe('DerivationService', () => {
    it('getPathFromPathNumber should return the proper paths', () => {
        for (let i = 0; i < 10; i++) {
            expect(DerivationService.getPathFromPathNumber(i)).to.equal(paths[i]);
        }
    });

    it('getPathFromPathNumber should throw if an invalid argument is provided', () => {
        expect(() => DerivationService.getPathFromPathNumber(-1)).to.throw();
        expect(() => DerivationService.getPathFromPathNumber(11)).to.throw();
    });

    it('getPathIndexFromPath should retun the right path indexes', () => {
        for (let i = 0; i < 10; i++) {
            expect(DerivationService.getPathIndexFromPath(paths[i])).to.equal(i);
        }
    });

    it('getPrivateKeyFromMnemonic should return the right private keys', () => {
        // eslint-disable-next-line max-len
        const mnemonic =
            'uniform promote eyebrow frequent mother order evolve spell elite lady clarify accuse annual tenant rotate walnut wisdom render before million scrub scan crush sense';

        expect(DerivationService.getPrivateKeyFromMnemonic(mnemonic, 0).toUpperCase()).to.equal(
            'A58BD9618B47F5E6B6BACB9B37CC242EDE1A0461AAE8FF2084BC825209D90E18',
        );

        expect(DerivationService.getPrivateKeyFromMnemonic(mnemonic, 5).toUpperCase()).to.equal(
            '549A3D5C0BA2453357728CDC46ECF65F472098814E41E12E2DE3F272B92BFEE7',
        );

        expect(DerivationService.getPrivateKeyFromMnemonic(mnemonic, 9).toUpperCase()).to.equal(
            '5D050D2B34000873A710EBF345BEFABAF4148BA4E13841AA8714A7C5EB4AF2DB',
        );
    });
});
