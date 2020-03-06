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
import {MosaicDefinitionTransaction} from 'symbol-sdk'

export class MosaicDefinitionView {
  /**
   * @static
   * @param {MosaicDefinitionTransaction} tx
   * @returns {CellRecord}
   */
  static get(tx: MosaicDefinitionTransaction): CellRecord {
    return {
      ['Mosaic Id']: tx.mosaicId.toHex(),
      ['Duration']: tx.duration.compact() > 0 ? `${tx.duration.compact().toLocaleString()} blocks` : 'unlimited',
      ['Divisibility']: `${tx.divisibility}`,
      ['Supply mutable']: `${tx.flags.supplyMutable}`,
      ['Transferable']: `${tx.flags.transferable}`,
      ['Restrictable']: `${tx.flags.restrictable}`,
    }
  }
}
