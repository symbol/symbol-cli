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
import { EpochAdjustmentResolver } from '../../src/resolvers/epochAdjustment.resolver';

describe('Epoch Adjustment resolver', () => {
    it('should return epoch adjustment', async () => {
        const options = { url: 'http://localhost:3000', epochAdjustment: 123 } as any;
        expect(await new EpochAdjustmentResolver().resolve(options)).to.be.equal(123);
    });
});
