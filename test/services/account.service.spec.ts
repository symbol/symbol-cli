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
import { Network } from 'symbol-hd-wallets';
import { Address, NamespaceId, NetworkType } from 'symbol-sdk';
import { AccountService } from '../../src/services/account.service';

describe('Account service', () => {
    it('should create account service', () => {
        expect(new AccountService()).to.not.be.equal(undefined);
    });

    it('should return an alias', () => {
        const rawRecipient = '@foo';
        expect(AccountService.getUnresolvedAddress(rawRecipient)).to.be.instanceOf(NamespaceId);
    });

    it('should return an address', () => {
        const rawRecipient = 'SDSMQK-MKCAE3-LHGKTD-NE7NYJ-OYEFDK-LAWAKW-KRA';
        expect(AccountService.getUnresolvedAddress(rawRecipient)).to.be.instanceOf(Address);
    });

    it('should generate accounts from mnemonic', () => {
        const mnemonic =
            'uniform promote eyebrow frequent mother order evolve spell elite lady clarify accuse annual tenant rotate walnut wisdom render before million scrub scan crush sense';
        const generatedAccounts = AccountService.generateAccountsFromMnemonic(mnemonic, NetworkType.TEST_NET, Network.SYMBOL);
        expect(generatedAccounts.length).to.be.eq(10);
        expect(generatedAccounts[0].privateKey).to.be.eq('44D827AB26A1BFEFB3491F6C37FB70258210F43947C4E9A52CAA7A1B27563E6B');
    });
});
