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
import {LockFundsTransaction} from 'symbol-sdk'

export class LockFundsView {
  /**
   * @static
   * @param {LockFundsTransaction} tx
   * @returns {CellRecord}
   */
  static get(tx: LockFundsTransaction): CellRecord {
    return {
      Duration: `${tx.duration.compact().toLocaleString()} blocks`,
      ...MosaicsView.get([tx.mosaic]),
    }
  }
}
