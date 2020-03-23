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

import {CellRecord} from '../views/transactions/details/transaction.view'
import * as Table from 'cli-table3'
import {HorizontalTable} from 'cli-table3'

export class TableBuilder {
  /**
   * Creates an HorizontalTable from a CellRecord
   * @static
   * @param {CellRecord} object
   * @returns {HorizontalTable}
   */
  static renderTableFromObject(object: CellRecord): HorizontalTable {
    const table = TableBuilder.getEmptyTable()
    Object.entries(object)
      // Filters out empty items. (eg ITransactionViewSignature)
      .filter((x) => x)
      .forEach(([label, value]) => {
        // handles <string, Cell> items
        if (typeof value === 'object') {
          table.push([value])
          return
        }
        // handles <string, string> items
        table.push([`${label}:`, `${value}`])
      })

    return table
  }

  /**
    Creates an HorizontalTable from a CellRecord array
   * @static
   * @param {CellRecord[]} array
   * @returns {HorizontalTable}
   */
  static renderTableFromArray(array: CellRecord[]): HorizontalTable {
    const table = TableBuilder.getEmptyTable()
    array
      // Filters out empty items
      .filter((x) => x && typeof x === 'object')
      .forEach((entry) => {
        const [entries] = Object.entries(entry)
        const [label, value] = entries

        // handles <string, Cell> items
        if (typeof value === 'object') {
          table.push([value])
          return
        }
        // handles <string, string> items
        table.push([`${label}:`, `${value}`])
      })

    return table
  }

  /**
   * Instantiates the Table
   * @static
   * @returns {HorizontalTable}
   */
  static getEmptyTable(): HorizontalTable {
    return new Table() as HorizontalTable
  }
}
