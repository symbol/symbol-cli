import { expect } from 'chai';

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
import { BLSPublicKeyResolver } from '../../src/resolvers/bls.resolver';

describe('BLS public key resolver', () => {
    it('should return public key', async () => {
        const linkedPublicKey = '0'.repeat(96);
        const options = { linkedPublicKey } as any;
        expect(await new BLSPublicKeyResolver().resolve(options)).to.be.equal(linkedPublicKey);
    });

    it('should return public key (alternative)', async () => {
        const publicKey = '0'.repeat(96);
        const options = { publicKey } as any;
        expect(await new BLSPublicKeyResolver().resolve(options, 'test', 'publicKey')).to.be.equal(publicKey);
    });
});
