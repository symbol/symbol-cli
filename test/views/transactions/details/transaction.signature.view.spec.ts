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
import { NetworkType, SignedTransaction, TransactionType } from 'symbol-sdk';
import { TransactionSignatureView } from '../../../../src/views/transactions/details/transaction.signature.view';

const mockSignedTransaction = new SignedTransaction(
    '0'.repeat(64),
    '1'.repeat(64),
    '2'.repeat(64),
    TransactionType.TRANSFER,
    NetworkType.MAIN_NET,
);

describe('Transaction signature view', () => {
    it('should format payload with 64 chars', () => {
        const signatureView = TransactionSignatureView.get(mockSignedTransaction);
        expect(signatureView.SignatureDetailsTitle).deep.equal({
            content: 'Signature details',
            colSpan: 2,
            hAlign: 'center',
        });
        expect(signatureView.Payload).equal('0000000000000000000000000000000000000000000000000000000000000000');
        expect(signatureView.Hash).equal('1111111111111111111111111111111111111111111111111111111111111111');
        expect(signatureView.Signer).equal('2222222222222222222222222222222222222222222222222222222222222222');
    });

    it('should format payload with less than 64 chars', () => {
        //@ts-ignore
        mockSignedTransaction.payload = '0'.repeat(30);
        const signatureView = TransactionSignatureView.get(mockSignedTransaction);

        expect(signatureView.SignatureDetailsTitle).deep.equal({
            content: 'Signature details',
            colSpan: 2,
            hAlign: 'center',
        });
        expect(signatureView.Payload).equal('000000000000000000000000000000');
    });

    it('should format payload with more than 64 chars', () => {
        // @ts-ignore
        mockSignedTransaction.payload = '0'.repeat(65);
        const signatureView = TransactionSignatureView.get(mockSignedTransaction);
        expect(mockSignedTransaction.payload.length).to.be.equal(65);
        expect(signatureView.Payload).equal('0000000000000000000000000000000000000000000000000000000000000000\n0');
    });

    it('Payload should be N/A when the provided payload was invalid', () => {
        // @ts-ignore
        mockSignedTransaction.payload = '';
        const signatureView = TransactionSignatureView.get(mockSignedTransaction);
        expect(signatureView.Payload).to.be.equal('N/A');
    });
});
