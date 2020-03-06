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

import {NamespacesView} from './namespaces.view'
import {CellRecord} from './transactions/details/transaction.view'
import {Mosaic, MosaicId, NamespaceId} from 'symbol-sdk'

export class MosaicsView {
 /**
  * Transforms mosaics into CellRecords to be used in view tables
  * @static
  * @param {Mosaic[]} mosaics
  * @returns {CellRecord}
  */
 static get(mosaics: Mosaic[]): CellRecord {
  return new MosaicsView(mosaics).render()
 }

 /**
  * Renders a string to be displayed in the view
  * Renders a namespace name if available (eg: symbol.xym (E74B99BA41F4AFEE))
  * @static
  * @param {(MosaicId | NamespaceId)} id
  * @returns {string}
  */
 static getMosaicLabel(id: MosaicId | NamespaceId): string {
  if (id instanceof MosaicId) {return id.toHex() }
  return NamespacesView.getNamespaceLabel(id)
 }

 /**
  * Creates an instance of MosaicsView.
  * @param {Mosaic[]} mosaics
  */
 private constructor(private readonly mosaics: Mosaic[]) {}

 /**
  * Transforms mosaics into CellRecords to be used in view tables
  * @private
  * @returns {CellRecord}
  */
 private render(): CellRecord {
  return this.mosaics.reduce((acc, mosaic, index) => ({
   ...acc,
   ...this.getRenderedMosaic(mosaic, index),
  }), {})
 }

 /**
  * Transforms a mosaic array into a CellRecord to be used in view tables
  * @private
  * @param {Mosaic} mosaic
  * @param {number} index
  * @returns {CellRecord}
  */
 private getRenderedMosaic(mosaic: Mosaic, index: number): CellRecord {
  const mosaicPrefix = MosaicsView.getMosaicLabel(mosaic.id)
  const positionInList = `${index + 1}/${this.mosaics.length}`
  const amount = mosaic.amount.compact().toLocaleString()

  return {
   [`Mosaic (${positionInList})`]: `${amount} ${mosaicPrefix}`,
  }
 }
}
