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

import { PageSizeResolver } from '../../src/resolvers/pageSize.resolver';

describe('Page number resolver', () => {
    it('should return page size', async () => {
        const pageSize = 1;
        const options = { pageSize } as any;
        expect(await new PageSizeResolver().resolve(options)).to.be.equal(pageSize);
    });

    it('should change key', async () => {
        const key = 1;
        const options = { key } as any;
        expect(await new PageSizeResolver().resolve(options, 'altText', 'key')).to.be.equal(key);
    });
});
