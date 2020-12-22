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
import { TransactionAnnounceService } from '../../src/services/transaction.announce.service';
import { mockPrivateKeyProfile1 } from '../mocks/profiles/profile.mock';

describe('Configure service', () => {
    it('should create transaction signature service', () => {
        const options = {
            maxFee: '1',
            profile: 'test',
            password: 'test',
            sync: false,
            announce: false,
            maxFeeHashLock: '50000',
            lockAmount: '10',
            lockDuration: '',
            signer: '',
            mode: 'normal',
        };
        expect(TransactionAnnounceService.create(mockPrivateKeyProfile1, options)).to.not.be.equal(undefined);
    });
});
