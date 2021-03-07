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
import { TransactionType } from 'symbol-sdk';
import { AggregateTypeResolver } from '../../src/resolvers/aggregateType.resolver';

describe('Aggregate type resolver', () => {
    it('should return AGGREGATE_BONDED', async () => {
        const options = { aggregateType: 'AGGREGATE_BONDED' } as any;
        expect(await new AggregateTypeResolver().resolve(options)).to.be.equal(TransactionType.AGGREGATE_BONDED);
    });

    it('should return AGGREGATE_COMPLETE', async () => {
        const options = { aggregateType: 'AGGREGATE_COMPLETE' } as any;
        expect(await new AggregateTypeResolver().resolve(options)).to.be.equal(TransactionType.AGGREGATE_COMPLETE);
    });
});
