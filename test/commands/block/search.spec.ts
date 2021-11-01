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
import { BlockSearchOptions } from '../../../src/commands/block/search';
import { account1 } from '../../mocks/accounts.mock';

describe('search options', () => {
    it('should build search criteria', async () => {
        const searchOptions = new BlockSearchOptions();
        searchOptions.order = 'Desc';
        searchOptions.pageSize = 10;
        searchOptions.pageNumber = 1;
        searchOptions.beneficiaryAddress = account1.address.plain();
        searchOptions.signerPublicKey = account1.publicKey;
        searchOptions.orderBy = 'Id';
        const searchCriteria = await searchOptions.buildSearchCriteria(NetworkType.TEST_NET);
        expect(searchCriteria.beneficiaryAddress).to.be.equal(account1.address.plain());
        expect(searchCriteria.signerPublicKey).to.be.equal(account1.publicKey);
        expect(searchCriteria.orderBy).to.be.equal('id');
    });
});
