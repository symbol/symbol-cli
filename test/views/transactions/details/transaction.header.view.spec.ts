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

import { TransactionHeaderView } from '../../../../src/views/transactions/details/transaction.header.view';
import { block1Transactions } from '../../../mocks/transactions/block1Transactions.mock';
import { unsignedTransfer1 } from '../../../mocks/transactions/transfer.mock';

describe('Transaction header view', () => {
    it('should return a view of an unsigned transaction', () => {
        const headerView = TransactionHeaderView.get(unsignedTransfer1);
        expect(headerView['Title']).deep.equal({
            content: 'TRANSFER',
            colSpan: 2,
            hAlign: 'center',
        });
        expect(headerView['Hash']).to.be.undefined;
        expect(headerView['Height (Block)']).to.be.undefined;
        expect(headerView['Index']).to.be.undefined;
        expect(headerView['Network type']).equal('MAIN_NET');
        expect(headerView['Deadline'].length > 0).to.be.ok;
        expect(headerView['Max fee']).equal('1,000');
        expect(headerView['Signer']).to.be.undefined;
    });

    it('should return a view of a signed transaction', () => {
        const [signedNamespaceRegistration] = block1Transactions;
        const headerView = TransactionHeaderView.get(signedNamespaceRegistration);
        expect(headerView['Title']).deep.equal({
            content: 'NAMESPACE_REGISTRATION',
            colSpan: 2,
            hAlign: 'center',
        });
        expect(headerView['Hash']).equal('AE20807998CE55A1971D0ACEE79B56F9A60E1A845EEBD29A9DC6243A64556116');
        expect(headerView['Max fee']).equal('0');
        expect(headerView['Index']).equal(0);
        expect(headerView['Network type']).equal('TEST_NET');
        expect(headerView['Deadline'].length > 0).to.be.ok;
        expect(headerView['Signer']).equal('TAL4UF-RKGFXZ-WMLH73-KEC54T-TUD3N5-XSNR2J-4VRG');
    });
});
