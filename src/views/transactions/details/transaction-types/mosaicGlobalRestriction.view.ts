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
import {MosaicGlobalRestrictionTransaction, MosaicRestrictionType} from 'symbol-sdk'

export class MosaicGlobalRestrictionView {
  /**
   * @static
   * @param {MosaicGlobalRestrictionTransaction} tx
   * @returns {CellRecord}
   */
  static get(tx: MosaicGlobalRestrictionTransaction): CellRecord {
    return {
      'Mosaic Id': tx.mosaicId.toHex(),
      'Reference mosaic Id': tx.referenceMosaicId.toHex(),
      'Restriction key': tx.restrictionKey.toHex(),
      'Previous restriction value': tx.previousRestrictionValue.toString(),
      'Previous restriction type': MosaicRestrictionType[tx.previousRestrictionType],
      'New restriction value': tx.newRestrictionValue.toString(),
      'New restriction type': MosaicRestrictionType[tx.newRestrictionType],
    }
  }
}
