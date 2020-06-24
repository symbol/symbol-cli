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

import { OrderResolver } from '../../src/resolvers/order.resolver';

describe('Order resolver', () => {
    it('should return order', async () => {
        const order = 'Asc';
        const options = { order } as any;
        expect(await new OrderResolver().resolve(options)).to.be.equal('asc');
    });

    it('should change key', async () => {
        const key = 'Desc';
        const options = { key } as any;
        expect(await new OrderResolver().resolve(options, 'altText', 'key')).to.be.equal('desc');
    });
});
