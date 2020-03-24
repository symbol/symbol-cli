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

import {
 TransactionStatement,
 Receipt,
 ReceiptType,
 BalanceTransferReceipt,
 BalanceChangeReceipt,
 InflationReceipt,
 ArtifactExpiryReceipt,
 MosaicId,
} from 'symbol-sdk'
import {AbstractStatementView} from './abstractStatementView.view'
import {CellRecord} from '../transactions/details/transaction.view'
import {RecipientsView} from '../recipients.view'

export class TransactionStatementViews extends AbstractStatementView {
 public constructor(private readonly statements: TransactionStatement[]) {super()}

 /**
  * Renders cell records
  * @returns {CellRecord[]}
  */
 public render(): CellRecord[][] | null{
  if (!this.statements.length) {return null}

  return this.statements
    .map(({height, source, receipts}, index, self) => ([
     this.getSectionTitle(`Transaction statement ${index + 1} of ${self.length}`),
     {Height: height.compact()},
     {Source: `Primary Id: ${source.primaryId}, Secondary Id: ${source.secondaryId}`},
     this.getSectionTitle('Transaction receipts'),
     ...this.renderReceipts(receipts),
    ]))
  }

 /**
  * Renders receipts
  * @private
  * @param {Receipt[]} receipts
  * @returns {CellRecord[]}
  */
 private renderReceipts(receipts: Receipt[]): CellRecord[] {
  return receipts
   .map((receipt, index, self) => this.renderReceipt(receipt, index, self.length))
   .reduce((acc, entry) => ([...acc, ...entry]), [])
 }

 /**
  * Renders a receipt
  * @private
  * @param {Receipt} receipt
  * @param {number} index
  * @param {number} numberOfReceipts
  * @returns {CellRecord[]}
  */
 private renderReceipt(
  receipt: Receipt,
  index: number,
  numberOfReceipts: number,
 ): CellRecord[] {
  const {type, size} = receipt
  return [
   this.getSectionTitle(`Receipt ${index + 1} of ${numberOfReceipts}`),
   {Type: ReceiptType[type]},
   {Size: size || 'N/A'},
   ...this.renderSpecificReceiptProperties(receipt),
  ]
 }

 /**
  * Renders a receipt specific properties
  * @private
  * @param {Receipt} receipt
  * @returns {CellRecord[]}
  */
 private renderSpecificReceiptProperties(receipt: Receipt): CellRecord[] {
  if (receipt instanceof BalanceTransferReceipt) {return this.renderBalanceTransferReceipt(receipt)}
  if (receipt instanceof BalanceChangeReceipt) {return this.renderBalanceChangeReceipt(receipt)}
  if (receipt instanceof ArtifactExpiryReceipt) {return this.renderArtifactExpiryReceipt(receipt)}
  if (receipt instanceof InflationReceipt) {return this.renderInflationReceipt(receipt)}
  throw new Error('unknown receipt instance provided to renderSpecificReceiptProperties ' + receipt.type)
 }

 /**
  * Renders a balance transfer receipt
  * @private
  * @param {BalanceTransferReceipt} receipt
  * @returns {CellRecord[]}
  */
 private renderBalanceTransferReceipt(receipt: BalanceTransferReceipt): CellRecord[] {
  return [
   {Sender: receipt.sender.address.pretty()},
   {Recipient: RecipientsView.get(receipt.recipientAddress)},
   {'Mosaic Id': receipt.mosaicId.toHex()},
   {Amount: receipt.amount.compact()},
  ]
 }

 /**
  *  Renders a balance change receipt
  * @private
  * @param {BalanceChangeReceipt} receipt
  * @returns {CellRecord[]}
  */
 private renderBalanceChangeReceipt(receipt: BalanceChangeReceipt): CellRecord[] {
  return [
   {'Target account': receipt.targetPublicAccount.address.pretty()},
   {MosaicId: receipt.mosaicId.toHex()},
   {Amount: receipt.amount.compact()},
  ]
 }

 /**
  * Renders an artifact expiry receipt
  * @private
  * @param {ArtifactExpiryReceipt} receipt
  * @returns {CellRecord[]}
  */
 private renderArtifactExpiryReceipt(receipt: ArtifactExpiryReceipt): CellRecord[] {
  const {artifactId} = receipt
  const artifactType = artifactId instanceof MosaicId ? 'Mosaic Id' : 'Namespace Id'
  return [{[artifactType]: artifactId.toHex()}]
 }

 /**
  * Renders an inflation receipt
  * @private
  * @param {InflationReceipt} receipt
  * @returns {CellRecord[]}
  */
 private renderInflationReceipt(receipt: InflationReceipt): CellRecord[] {
  return [
   {MosaicId: receipt.mosaicId.toHex()},
   {Amount: receipt.amount.compact()},
  ]
 }
}


