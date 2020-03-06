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

import {CellRecord} from '../transaction.view'
import {transactionDetailViewFactory} from '../transactionDetailViewFactory'
import {transactionNameFromType} from '../transactionNameFromType'
import {AggregateTransaction} from 'symbol-sdk'
import {Cell} from 'cli-table3'

export abstract class AggregateView {
  /**
   * Number of inner transactions in the aggregate
   * @private
   * @type {number}
   */
  private numberOfInnerTx: number

  /**
   * Creates an instance of AggregateView.
   * @param {AggregateTransaction} tx
   */
  protected constructor(protected readonly tx: AggregateTransaction) {}

  /**
   * Gets the view of an inner transaction
   * @protected
   * @returns {CellRecord}
   */
  protected getInnerTransactionViews(): CellRecord {
    const innerTransactionsViews = this.tx.innerTransactions.map(
      (transaction) => transactionDetailViewFactory(transaction),
    )

    this.numberOfInnerTx = innerTransactionsViews.length

    return {
      ...innerTransactionsViews
        .reduce((acc, view, index) => ({
          ...acc,
          [`title${index}`]: this.getInnerTransactionTitle(index),
          ...this.getPrefixedInnerTransactionView(view, index),
        }), {}),
    }
  }

  /**
   * Returns a full-width horizontally centered cell
   * With the inner transaction type and its position in the aggregate transaction
   * @private
   * @param {number} index
   * @returns {Cell}
   */
  private getInnerTransactionTitle(index: number): Cell {
    const txType = transactionNameFromType(this.tx.innerTransactions[index].type)

    return {
      content: `Inner transaction ${index + 1} of ${this.numberOfInnerTx} - ${txType}`,
      colSpan: 2,
      hAlign: 'center',
    }
  }

  /**
   * Prefixes each CellRecord key of the inner transaction view
   * With its position in the aggregate transaction
   * @private
   * @param {CellRecord} view
   * @param {number} index
   * @returns {CellRecord}
   */
  private getPrefixedInnerTransactionView(view: CellRecord, index: number): CellRecord {
    return Object.entries(view)
      .map(([label, value]) => ({
        [`[Inner tx. ${index + 1} of ${this.numberOfInnerTx}] ${label}`]: value,
      }))
      .reduce((acc, item) => ({...acc, ...item}))
  }
}
