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
import {CosignatoryModificationAction, MultisigAccountModificationTransaction} from 'symbol-sdk'

export class MultisigAccountModificationView {
  /**
   * @static
   * @param {MultisigAccountModificationTransaction} tx
   * @returns {CellRecord}
   */
  static get(tx: MultisigAccountModificationTransaction): CellRecord {
    return new MultisigAccountModificationView(tx).render()
  }

  /**
   * Creates an instance of MultisigAccountModificationView.
   * @param {MultisigAccountModificationTransaction} tx
   */
  private constructor(private readonly tx: MultisigAccountModificationTransaction) {}

  /**
   * @private
   * @returns {CellRecord}
   */
  private render(): CellRecord {
    return {
      'Min approval delta': `${this.tx.minApprovalDelta}`,
      'Min removal delta': `${this.tx.minRemovalDelta}`,
      ...this.getModifications(),
    }
  }

  /**
   * @private
   * @returns {CellRecord}
   */
  private getModifications(): CellRecord {
    return {
      ...this.renderModifications(CosignatoryModificationAction.Add),
      ...this.renderModifications(CosignatoryModificationAction.Remove),
    }
  }

  /**
   * @private
   * @param {CosignatoryModificationAction} type
   * @returns {CellRecord}
   */
  private renderModifications(type: CosignatoryModificationAction): CellRecord {
    const targetProperty = type === CosignatoryModificationAction.Add
      ? 'publicKeyAdditions' : 'publicKeyDeletions'

    const targetPropertyName = type === CosignatoryModificationAction.Add
      ? 'Public key addition' : 'Public key deletion'

    const modifications = this.tx[targetProperty]
    const modificationNumber = modifications.length

    if (modificationNumber === 0) {return {} }

    const getKey = (index: number) => `${targetPropertyName} (${index + 1} / ${modificationNumber})`

    return modifications.reduce((acc, publicAccount, index) => ({
      ...acc,
      [getKey(index)]: publicAccount.address.pretty(),
    }), {})
  }
}
