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
import {NamespaceRegistrationTransaction, NamespaceRegistrationType} from 'symbol-sdk'

export class NamespaceRegistrationView {
  /**
   * @static
   * @param {NamespaceRegistrationTransaction} tx
   * @returns {CellRecord}
   */
  static get(tx: NamespaceRegistrationTransaction): CellRecord {
    return new NamespaceRegistrationView(tx).render()
  }

  /**
   * Creates an instance of NamespaceRegistrationView.
   * @param {NamespaceRegistrationTransaction} tx
   */
  private constructor(private readonly tx: NamespaceRegistrationTransaction) {}

  /**
   * @private
   * @returns {CellRecord}
   */
  private render(): CellRecord {
    return {
      'Namespace name': this.tx.namespaceName,
      ...this.tx.registrationType === NamespaceRegistrationType.RootNamespace
        ? this.getRootNamespaceProps() : this.getSubNamespaceProps(),
    }
  }

  /**
   * @private
   * @returns {CellRecord}
   */
  private getRootNamespaceProps(): CellRecord {
    if (!this.tx.duration) {
      throw new Error('No duration found in getRootNamespaceProps')
    }

    return {
      Type: 'Root namespace',
      Duration: `${this.tx.duration.toString()} blocks`,
    }
  }

  /**
   * @private
   * @returns {CellRecord}
   */
  private getSubNamespaceProps(): CellRecord {
    if (!this.tx.parentId) {
      throw new Error('No parent Id found in getSubNamespaceProps')
    }

    return {
      'Type': 'Sub namespace',
      'Parent Id': this.tx.parentId.toHex(),
    }
  }
}
