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

import {CellRecord} from './transaction.view'
import {Cell} from 'cli-table3'
import {SignedTransaction} from 'symbol-sdk'

export interface ITransactionViewSignature extends CellRecord {
 SignatureDetailsTitle: Cell;
 Payload: string | undefined;
 Hash: string;
 Signer: string;
}

export class TransactionSignatureView {
 /**
  * @static
  * @param {Transaction} transaction
  * @returns {ITransactionHeaderView}
  */
 static get(signedTransaction: SignedTransaction): ITransactionViewSignature {
  return new TransactionSignatureView(signedTransaction).render()
 }

 /**
  * Creates an instance of TransactionSignatureView.
  * @param {SignedTransaction} tx
  */
 private constructor(private readonly tx: SignedTransaction) {}

 /**
  * @private
  * @returns {ITransactionHeaderView}
  */
 private render(): ITransactionViewSignature {
  return {
   SignatureDetailsTitle: this.title,
   Payload: this.formattedPayload,
   Hash: this.tx.hash,
   Signer: this.tx.signerPublicKey,
  }
 }

 /**
  * Creates a full-width and vertically centered cell
  * @readonly
  * @type {Cell} Table title
  */
 get title(): Cell {
  return {
   content: 'Signature details',
   colSpan: 2,
   hAlign: 'center',
  }
 }

 /**
  * Formatted payload that fits in the command line.
  * @readonly
  * @protected
  * @type {(string | undefined)}
  */
 protected get formattedPayload(): string | undefined {
  const payload = this.tx.payload.match(/.{1,64}/g)?.join('\n')
  if (!payload) { return 'N/A' }
  return payload
 }
}
