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
import { DefaultResolver } from '../../src/resolvers/default.resolver';

describe('Default resolver', () => {
    it('should return boolean', async () => {
        const options = {
            save: false,
            url: '',
            network: '',
            profile: '',
            password: '',
            default: true,
            epochAdjustment: 123,
            generationHash: '1',
            namespaceId: '',
            divisibility: 0,
            'private-key': true,
            mnemonic: false,
            hd: false,
            ledger: false,
        };
        expect(await new DefaultResolver().resolve(options)).to.be.equal(true);
    });
});
