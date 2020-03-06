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
import {transactionNameFromType} from './transactionNameFromType'
import {Cell} from 'cli-table3'
import {AggregateTransactionInfo, NetworkType, Transaction} from 'symbol-sdk'

export interface ITransactionHeaderView extends CellRecord {
  'Title': Cell;
  'Hash': string | null;
  'Network type': string;
  'Deadline': string;
  'Max fee': string;
  'Signer': string | null;
}

export class TransactionHeaderView {
  /**
   * @static
   * @param {Transaction} transaction
   * @returns {ITransactionHeaderView}
   */
  static get(transaction: Transaction): ITransactionHeaderView {
    return new TransactionHeaderView(transaction).render()
  }

  /**
   * Creates an instance of TransactionHeaderView.
   * @param {Transaction} tx
   */
  private constructor(private readonly tx: Transaction) {}

  /**
   * @private
   * @returns {ITransactionHeaderView}
   */
  private render(): ITransactionHeaderView {
    return {
      ['Title']: this.title,
      ['Hash']: this.hash,
      ['Network type']: NetworkType[this.tx.networkType],
      ['Deadline']: this.formattedDeadline,
      ['Max fee']: this.tx.maxFee.compact().toLocaleString(),
      ['Signer']: this.signer,
    }
  }

  /**
   * Creates a full-width and vertically centered cell with the transaction type
   * @readonly
   * @protected
   * @type {Cell} Table title
   */
  protected get title(): Cell {
    return {
      content: transactionNameFromType(this.tx.type),
      colSpan: 2,
      hAlign: 'center',
    }
  }

  /**
   * @readonly
   * @protected
   * @type {string | null} TransactionHash
   */
  protected get hash(): string | null {
    const {transactionInfo} = this.tx
    if (!transactionInfo) {return null }
    if (transactionInfo instanceof AggregateTransactionInfo) {
      return transactionInfo.aggregateHash
    }
    return transactionInfo.hash || null
  }

  /**
   * @readonly
   * @protected
   * @type {string | null} Transaction signer
   */
  protected get signer(): string | null {
    const {signer} = this.tx
    if (!signer) {return null }
    return signer.address.pretty()
  }

  /**
   * Human readable deadline
   * @readonly
   * @protected
   * @type {string}
   */
  protected get formattedDeadline(): string {
    const {deadline} = this.tx
    return `${deadline.value.toLocalDate()} ${deadline.value.toLocalTime()}`
  }
}
