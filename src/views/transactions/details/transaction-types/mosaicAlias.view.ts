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

import {NamespacesView} from '../../../namespaces.view'
import {CellRecord} from '../transaction.view'
import {AliasAction, MosaicAliasTransaction} from 'symbol-sdk'

export class MosaicAliasView {
  /**
   * @static
   * @param {MosaicAliasTransaction} tx
   * @returns {CellRecord}
   */
  static get(tx: MosaicAliasTransaction): CellRecord {
    return {
      'Alias action': AliasAction[tx.aliasAction],
      'Mosaic Id': tx.mosaicId.toHex(),
      'Namespace Id': NamespacesView.getNamespaceLabel(tx.namespaceId),
    }
  }
}
