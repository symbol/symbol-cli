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

import {TableBuilder} from '../../../models/tableBuilder.model'
import {ITransactionHeaderView, TransactionHeaderView} from './transaction.header.view'
import {ITransactionViewSignature, TransactionSignatureView} from './transaction.signature.view'
import {transactionDetailViewFactory} from './transactionDetailViewFactory'
import {SignedTransaction, Transaction} from 'symbol-sdk'
import {Cell, HorizontalTable} from 'cli-table3'

export type CellRecord = Record<string, string | Cell>

export class TransactionView {
  /**
   * Properties common to all transactions
   * @type {ITransactionHeaderView}
   */
  header: ITransactionHeaderView
  /**
   * Properties specific to the transaction type
   * @type {CellRecord}
   */
  details: CellRecord
  /**
   * Properties specific to a transaction signature
   * @type {ITransactionViewSignature}
   */
  signature?: ITransactionViewSignature

  /**
   * Creates an instance of TransactionView.
   * @param {Transaction} transaction
   * @param {SignedTransaction} [signedTransaction]
   */
  constructor(transaction: Transaction, signedTransaction?: SignedTransaction) {
    this.header = TransactionHeaderView.get(transaction)
    this.details = transactionDetailViewFactory(transaction)
    this.signature = signedTransaction && TransactionSignatureView.get(signedTransaction)
  }

  /**
   * Logs the table
   */
  print(): void {
    console.log(this.render().toString())
  }

  /**
   * @returns {HorizontalTable}
   */
  render(): HorizontalTable {
    return TableBuilder.renderTableFromObject(this.sanitizedCellRecord)
  }

  /**
   * The whole CellRecord to render in a table, without empty values
   * @readonly
   * @protected
   * @type {CellRecord}
   */
  protected get sanitizedCellRecord(): CellRecord {
    const headerNoNull = this.filterNullValues(this.header)
    const detailsNoNull = this.filterNullValues(this.details)
    const signatureNoNull = this.signature ? this.filterNullValues(this.signature) : undefined

    const allCellRecordsNoNull = {
      ...headerNoNull,
      ...detailsNoNull,
      ...signatureNoNull,
    }

    if (!allCellRecordsNoNull) {
      throw new Error('Something went wrong at sanitizedCellRecord')
    }

    return allCellRecordsNoNull
  }

  /**
   * Filters out null values (eg. hash in ITransactionHeaderView)
   * @private
   * @param {CellRecord} cellRecord
   * @returns {CellRecord}
   */
  private filterNullValues(cellRecord: CellRecord): CellRecord {
    Object.keys(cellRecord).forEach(
        (key) => (cellRecord[key] == null) && delete cellRecord[key],
    )
    return cellRecord
  }
}
