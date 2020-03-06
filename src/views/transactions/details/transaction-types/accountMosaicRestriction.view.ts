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

import {MosaicsView} from '../../../mosaics.view'
import {CellRecord} from '../transaction.view'
import {AccountMosaicRestrictionTransaction, AccountRestrictionFlags, MosaicId, NamespaceId} from 'symbol-sdk'

export class AccountMosaicRestrictionView {
  /**
   * @static
   * @param {AccountMosaicRestrictionTransaction} tx
   * @returns {CellRecord}
   */
  static get(tx: AccountMosaicRestrictionTransaction): CellRecord {
    return new AccountMosaicRestrictionView(tx).render()
  }

  /**
   * Creates an instance of AccountMosaicRestrictionView.
   * @param {AccountMosaicRestrictionTransaction} tx
   */
  private constructor(private readonly tx: AccountMosaicRestrictionTransaction) {}

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
      ...this.tx.restrictionAdditions.reduce((acc, mosaic, index) => ({
        ...acc,
        ...this.renderRestriction(
          mosaic, index, numberOfAdditions, 'Addition',
        ),
      }), {}),
      ...this.tx.restrictionDeletions.reduce((acc, mosaic, index) => ({
        ...acc,
        ...this.renderRestriction(
          mosaic, index, numberOfDeletions, 'Deletion',
        ),
      }), {}),
    }
  }

  /**
   * @private
   * @param {(MosaicId | NamespaceId)} mosaicId
   * @param {number} index
   * @param {number} numberOfRestrictions
   * @param {('Addition' | 'Deletion')} additionOrDeletion
   * @returns {CellRecord}
   */
  private renderRestriction(
    mosaicId: MosaicId | NamespaceId,
    index: number,
    numberOfRestrictions: number,
    additionOrDeletion: 'Addition' | 'Deletion',
  ): CellRecord {
    const key = `${additionOrDeletion} ${index + 1} of ${numberOfRestrictions}`
    return {[key]: MosaicsView.getMosaicLabel(mosaicId)}
  }
}
