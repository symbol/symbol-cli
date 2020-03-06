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
import {AggregateView} from './aggregate.view'
import {AggregateTransaction} from 'symbol-sdk'

export class AggregateBondedView extends AggregateView {
  /**
   * @static
   * @param {AggregateTransaction} tx
   * @returns {CellRecord}
   */
  static get(tx: AggregateTransaction): CellRecord {
    return new AggregateBondedView(tx).render()
  }

  /**
   * Creates an instance of AggregateBondedView.
   * @param {AggregateTransaction} tx
   */
  private constructor(tx: AggregateTransaction) {
    super(tx)
  }

  /**
   * @private
   * @returns {CellRecord}
   */
  private render(): CellRecord {
    const innerTransactionsViews = this.getInnerTransactionViews()

    return {
      ...innerTransactionsViews,
      ...this.getCosignedBy(),
    }
  }

  /**
   * @private
   * @returns {CellRecord}
   */
  private getCosignedBy(): CellRecord {
    if (!this.tx.signer) {return {} }

    return {
      'Cosigner 1': this.tx.signer.address.pretty(),
      ...this.tx.cosignatures.reduce((acc, {signer}, index) => ({
        ...acc, [`Cosigner ${index + 2}`]: signer.address.pretty(),
      }), {}),
    }
  }
}
