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
import { FinalizationPointResolver } from '../../src/resolvers/finalizationPoint.resolver';

describe('Finalization point resolver', () => {
    it('should return point', async () => {
        const point = '15';
        const options = { point } as any;
        expect((await new FinalizationPointResolver().resolve(options)).toString()).to.be.equal(point);
    });

    it('should change key', async () => {
        const key = '16';
        const options = { key } as any;
        expect((await new FinalizationPointResolver().resolve(options, 'altText', 'key')).toString()).to.be.equal(key);
    });
});
