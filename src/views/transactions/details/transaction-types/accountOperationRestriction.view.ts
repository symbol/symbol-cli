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
import {AccountOperationRestrictionTransaction, AccountRestrictionFlags, TransactionType} from 'symbol-sdk'

export class AccountOperationRestrictionView {
  /**
   * @static
   * @param {AccountOperationRestrictionTransaction} tx
   * @returns {CellRecord}
   */
  static get(tx: AccountOperationRestrictionTransaction): CellRecord {
    return new AccountOperationRestrictionView(tx).render()
  }

  /**
   * Creates an instance of AccountOperationRestrictionView.
   * @param {AccountOperationRestrictionTransaction} tx
   */
  private constructor(private readonly tx: AccountOperationRestrictionTransaction) {}

  /**
   * @private
   * @returns {CellRecord}
   */
  private render(): CellRecord {
    return {
      'Account restriction flag': AccountRestrictionFlags[this.tx.restrictionFlags],
      ...this.getRestrictions(),
    }
  }

  /**
   * @private
   * @returns {CellRecord}
   */
  private getRestrictions(): CellRecord {
    const numberOfAdditions = this.tx.restrictionAdditions.length
    const numberOfDeletions = this.tx.restrictionDeletions.length
    return {
      ...this.tx.restrictionAdditions.reduce((acc, transactionType, index) => ({
        ...acc,
        ...this.renderRestriction(
          transactionType, index, numberOfAdditions, 'Addition',
        ),
      }), {}),
      ...this.tx.restrictionDeletions.reduce((acc, transactionType, index) => ({
        ...acc,
        ...this.renderRestriction(
          transactionType, index, numberOfDeletions, 'Deletion',
        ),
      }), {}),
    }
  }

  /**
   * @private
   * @param {TransactionType} transactionType
   * @param {number} index
   * @param {number} numberOfRestrictions
   * @param {('Addition' | 'Deletion')} additionOrDeletion
   * @returns {CellRecord}
   */
  private renderRestriction(
    transactionType: TransactionType,
    index: number,
    numberOfRestrictions: number,
    additionOrDeletion: 'Addition' | 'Deletion',
  ): CellRecord {
    const key = `${additionOrDeletion} ${index + 1} of ${numberOfRestrictions}`
    return {[key]: TransactionType[transactionType]}
  }
}
