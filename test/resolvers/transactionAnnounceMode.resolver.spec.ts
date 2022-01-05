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
import { TransactionAnnounceModeResolver } from '../../src/resolvers/transactionAnnounceMode.resolver';

describe('Transaction announce mode resolver', () => {
    it('should return TransactionAnnounceMode', async () => {
        const mode = 'normal';
        const options = { mode } as any;
        expect(await new TransactionAnnounceModeResolver(NetworkType.TEST_NET).resolve(options)).to.be.equal('normal');
    });

    it('should return TransactionAnnounceMode', async () => {
        const mode = 'multisig';
        const options = { mode } as any;
        expect(await new TransactionAnnounceModeResolver(NetworkType.TEST_NET).resolve(options)).to.be.equal('multisig');
    });

    it('should work with public key', async () => {
        const signer = '0'.repeat(64);
        const options = { signer } as any;
        expect(await new TransactionAnnounceModeResolver(NetworkType.TEST_NET).resolve(options)).to.be.equal('multisig');
    });
});
