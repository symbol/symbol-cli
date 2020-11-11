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
import { RestrictionValueResolver } from '../../src/resolvers/restrictionValue.resolver';

describe('Restriction value resolver', () => {
    describe('resolve', () => {
        it('should return UInt64 value', async () => {
            const newRestrictionValue = '123';
            const options = { newRestrictionValue } as any;
            expect(await new RestrictionValueResolver().resolve(options)).to.be.equal('123');
        });

        it('should change key', async () => {
            const key = '123';
            const options = { key } as any;
            expect(await new RestrictionValueResolver().resolve(options, 'altText', 'key')).to.be.equal('123');
        });
    });
});
