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

import { SecretLockView } from '../../../../../src/views/transactions/details/transaction-types';
import { unsignedSecretLock1 } from '../../../../mocks/transactions/secretLock.mock';

describe('SecretLockView', () => {
    it('should return a view', () => {
        const view = SecretLockView.get(unsignedSecretLock1);
        expect(view['Recipient']).equal('alice (9CF66FB0CFEED2E0)');
        expect(view['Mosaic (1/1)']).equal('1,234,567,890 symbol.xym (E74B99BA41F4AFEE)');
        expect(view['Duration']).equal('100');
        expect(view['Hash type']).equal('Op_Sha3_256');
        expect(view['Secret']).equal('9b3155b37159da50aa52d5967c509b410f5a36a3b1e31ecb5ac76675d79b4a5e');
    });
});
