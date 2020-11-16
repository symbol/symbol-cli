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
import { NetworkType, TransactionGroup, TransactionType, UInt64 } from 'symbol-sdk';
import { TransactionSearchOptions } from '../../../src/commands/transaction/search';
import { account1 } from '../../mocks/accounts.mock';

describe('search options', () => {
    it('should build search criteria', async () => {
        const searchOptions = new TransactionSearchOptions();
        searchOptions.order = 'Desc';
        searchOptions.pageSize = 10;
        searchOptions.pageNumber = 1;
        searchOptions.group = 'Confirmed';
        searchOptions.address = account1.address.plain();
        searchOptions.recipientAddress = account1.address.plain();
        searchOptions.signerPublicKey = account1.publicKey;
        searchOptions.height = '1';
        searchOptions.type = 'TRANSFER';
        const searchCriteria = await searchOptions.buildSearchCriteria(NetworkType.MIJIN_TEST);
        expect(searchCriteria.group).to.be.equal(TransactionGroup.Confirmed);
        expect(searchCriteria.address?.plain()).to.be.equal(account1.address.plain());
        expect(searchCriteria.recipientAddress?.plain()).to.be.equal(account1.address.plain());
        expect(searchCriteria.signerPublicKey).to.be.equal(account1.publicKey);
        expect(searchCriteria.height?.compact()).to.be.equal(UInt64.fromUint(1).compact());
        expect(searchCriteria.type).to.be.deep.equal([TransactionType.TRANSFER]);
    });
});
