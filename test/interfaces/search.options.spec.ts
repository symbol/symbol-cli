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
import { SearchOptions } from '../../src/interfaces/search.options';

describe('search options', () => {
    it('should build search criteria', async () => {
        const searchOptions = new SearchOptions();
        searchOptions.order = 'Desc';
        searchOptions.pageSize = 10;
        searchOptions.pageNumber = 1;
        searchOptions.offset = '123';
        const searchCriteria = await searchOptions['buildBaseSearchCriteria']();
        expect(searchCriteria.order).to.be.equal('desc');
        expect(searchCriteria.pageNumber).to.be.equal(1);
        expect(searchCriteria.pageSize).to.be.equal(10);
        expect(searchCriteria.offset).to.be.equal('123');
    });
});
