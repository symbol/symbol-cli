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

import { AccountOperationRestrictionView } from '../../../../../src/views/transactions/details/transaction-types';
import {
    operation1,
    operation2,
    operation3,
    unsignedAccountOperationRestriction1,
} from '../../../../mocks/transactions/accountOperationRestriction.mock';

describe('AccountOperationRestrictionView', () => {
    it('should return a view', () => {
        const view = AccountOperationRestrictionView.get(unsignedAccountOperationRestriction1);
        expect(view['Account restriction flag']).equal('AllowOutgoingTransactionType');
        expect(view['Addition 1 of 2']).equal(TransactionType[operation1]);
        expect(view['Addition 2 of 2']).equal(TransactionType[operation2]);
        expect(view['Deletion 1 of 1']).equal(TransactionType[operation3]);
    });
});
