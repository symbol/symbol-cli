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

import { MultisigAccountModificationView } from '../../../../../src/views/transactions/details/transaction-types';
import { account1, account2, account3 } from '../../../../mocks/accounts.mock';
import { unsignedMultisigAccountModification1 } from '../../../../mocks/transactions/multisigAccountModification.mock';

describe('MultisigAccountModificationView', () => {
    it('should return a view', () => {
        const view = MultisigAccountModificationView.get(unsignedMultisigAccountModification1);
        expect(view['Min approval delta']).equal('2');
        expect(view['Min removal delta']).equal('1');
        expect(view['Public key addition (1 / 2)']).equal(account1.address.pretty());
        expect(view['Public key addition (2 / 2)']).equal(account2.address.pretty());
        expect(view['Public key deletion (1 / 1)']).equal(account3.address.pretty());
    });
});
