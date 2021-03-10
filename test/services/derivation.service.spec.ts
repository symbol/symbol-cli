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
import { NetworkType } from 'symbol-sdk';
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

const paths_test = [
    "m/44'/1'/0'/0'/0'",
    "m/44'/1'/1'/0'/0'",
    "m/44'/1'/2'/0'/0'",
    "m/44'/1'/3'/0'/0'",
    "m/44'/1'/4'/0'/0'",
    "m/44'/1'/5'/0'/0'",
    "m/44'/1'/6'/0'/0'",
    "m/44'/1'/7'/0'/0'",
    "m/44'/1'/8'/0'/0'",
    "m/44'/1'/9'/0'/0'",
];

describe('DerivationService_main', () => {
    it('getPathFromPathNumber should return the proper paths', () => {
        for (let i = 0; i < 10; i++) {
            expect(DerivationService.getPathFromPathNumber(i, NetworkType.MAIN_NET)).to.equal(paths[i]);
        }
    });

    it('getPathFromPathNumber should throw if an invalid argument is provided', () => {
        expect(() => DerivationService.getPathFromPathNumber(-1, NetworkType.MAIN_NET)).to.throw();
        expect(() => DerivationService.getPathFromPathNumber(11, NetworkType.MAIN_NET)).to.throw();
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

        expect(DerivationService.getPrivateKeyFromMnemonic(mnemonic, 0, NetworkType.MAIN_NET).toUpperCase()).to.equal(
            'F3C1B6EF898665942808EDBE23302377E508AE32F61F6F76BE691BE07B58823E',
        );

        expect(DerivationService.getPrivateKeyFromMnemonic(mnemonic, 5, NetworkType.MAIN_NET).toUpperCase()).to.equal(
            '5F3E543556B91B24441B29BDF05707AE2E70D9F5CC4C7F77362D22CD6359A8CD',
        );

        expect(DerivationService.getPrivateKeyFromMnemonic(mnemonic, 9, NetworkType.MAIN_NET).toUpperCase()).to.equal(
            '2DAD7D36B751708DDE3D65AB7FE07D6FD9925662A540851C7258842E52D4EDD5',
        );
    });

    it('getPrivateKeyFromOptinMnemonic should return the right private keys', () => {
        // eslint-disable-next-line max-len
        const mnemonic =
            'uniform promote eyebrow frequent mother order evolve spell elite lady clarify accuse annual tenant rotate walnut wisdom render before million scrub scan crush sense';

        expect(DerivationService.getPrivateKeyFromOptinMnemonic(mnemonic, 0, NetworkType.MAIN_NET).toUpperCase()).to.equal(
            'A58BD9618B47F5E6B6BACB9B37CC242EDE1A0461AAE8FF2084BC825209D90E18',
        );

        expect(DerivationService.getPrivateKeyFromOptinMnemonic(mnemonic, 5, NetworkType.MAIN_NET).toUpperCase()).to.equal(
            '549A3D5C0BA2453357728CDC46ECF65F472098814E41E12E2DE3F272B92BFEE7',
        );

        expect(DerivationService.getPrivateKeyFromOptinMnemonic(mnemonic, 9, NetworkType.MAIN_NET).toUpperCase()).to.equal(
            '5D050D2B34000873A710EBF345BEFABAF4148BA4E13841AA8714A7C5EB4AF2DB',
        );
    });
});

describe('DerivationService_test', () => {
    it('getPathFromPathNumber should return the proper paths', () => {
        for (let i = 0; i < 10; i++) {
            expect(DerivationService.getPathFromPathNumber(i, NetworkType.TEST_NET)).to.equal(paths_test[i]);
        }
    });

    it('getPathFromPathNumber should throw if an invalid argument is provided', () => {
        expect(() => DerivationService.getPathFromPathNumber(-1, NetworkType.TEST_NET)).to.throw();
        expect(() => DerivationService.getPathFromPathNumber(11, NetworkType.TEST_NET)).to.throw();
    });

    it('getPathIndexFromPath should retun the right path indexes', () => {
        for (let i = 0; i < 10; i++) {
            expect(DerivationService.getPathIndexFromPath(paths_test[i])).to.equal(i);
        }
    });

    it('getPrivateKeyFromMnemonic should return the right private keys', () => {
        // eslint-disable-next-line max-len
        const mnemonic =
            'uniform promote eyebrow frequent mother order evolve spell elite lady clarify accuse annual tenant rotate walnut wisdom render before million scrub scan crush sense';

        expect(DerivationService.getPrivateKeyFromMnemonic(mnemonic, 0, NetworkType.TEST_NET).toUpperCase()).to.equal(
            '44D827AB26A1BFEFB3491F6C37FB70258210F43947C4E9A52CAA7A1B27563E6B',
        );

        expect(DerivationService.getPrivateKeyFromMnemonic(mnemonic, 5, NetworkType.TEST_NET).toUpperCase()).to.equal(
            '190BCA6AC77B40AFCCDCDC83AC3639B753774C27FCA8FADD23F853D9F80EBD48',
        );

        expect(DerivationService.getPrivateKeyFromMnemonic(mnemonic, 9, NetworkType.TEST_NET).toUpperCase()).to.equal(
            '0B099FF928D0DFCCDC9F7845A8BF4ED49155E95F0DF1FB2912F7929FE06ADEAF',
        );
    });

    it('getPrivateKeyFromOptinMnemonic should return the right private keys', () => {
        // eslint-disable-next-line max-len
        const mnemonic =
            'uniform promote eyebrow frequent mother order evolve spell elite lady clarify accuse annual tenant rotate walnut wisdom render before million scrub scan crush sense';

        expect(DerivationService.getPrivateKeyFromOptinMnemonic(mnemonic, 0, NetworkType.TEST_NET).toUpperCase()).to.equal(
            '82591CDD1F3B7DBDB8A3A2175E30DEBAD8F7F4238D097B897F310DBD00518B39',
        );

        expect(DerivationService.getPrivateKeyFromOptinMnemonic(mnemonic, 5, NetworkType.TEST_NET).toUpperCase()).to.equal(
            '69A3E9EA85C0B33B4C6FA8BC8650165A03C68F3F96A5CB3B009D86B61A72A08B',
        );

        expect(DerivationService.getPrivateKeyFromOptinMnemonic(mnemonic, 9, NetworkType.TEST_NET).toUpperCase()).to.equal(
            '8728B5421101322665FD8A30E854EE304C19ADA136C819BB9CC0BB4B63B970B3',
        );
    });

    //TODO add tests for non-optin accunts => getPrivateKeyFromMnemonic should return the right private keys
});
