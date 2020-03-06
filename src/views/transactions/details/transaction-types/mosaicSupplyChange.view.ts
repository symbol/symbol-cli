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
import {MosaicSupplyChangeAction, MosaicSupplyChangeTransaction} from 'symbol-sdk'

export class MosaicSupplyChangeView {
  /**
   * @static
   * @param {MosaicSupplyChangeTransaction} tx
   * @returns {CellRecord}
   */
  static get(tx: MosaicSupplyChangeTransaction): CellRecord {
    return {
      'Mosaic Id': tx.mosaicId.toHex(),
      'Direction': tx.action === MosaicSupplyChangeAction.Increase
        ? 'Increase supply' : 'Decrease supply',
      'Delta': tx.delta.compact().toLocaleString(),
    }
  }
}
