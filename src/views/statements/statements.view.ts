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

import chalk from 'chalk'
import {Statement} from 'symbol-sdk'

import {TableBuilder} from '../../models/tableBuilder.model'
import {CellRecord} from '../transactions/details/transaction.view'
import {TransactionStatementViews} from './transactionStatements.view'
import {ResolutionStatementViews} from './resolutionStatements.view'


export class StatementsView {
  public constructor(private statement: Statement) {}

  /**
   * Logs the table
   */
  public print(): void {
    Object
      .entries(this.tableEntries)
      .forEach(([tableName, entries]) => {
        if (!entries) {return}
        console.log(chalk.bold(tableName))
        entries.forEach(
          (entry) => console.log(`${TableBuilder.renderTableFromArray(entry)} \n\n`),
        )
      })
  }

  /**
   * The whole CellRecord to render in a table, without empty values
   * @readonly
   * @protected
   * @type {CellRecord}
   */
  public get tableEntries(): {
    'Transaction statements': CellRecord[][] | null;
    'Address resolution statements': CellRecord[][] | null;
    'Mosaic resolution statements': CellRecord[][] | null;
  }  {
    return {
      'Transaction statements': new TransactionStatementViews(this.statement.transactionStatements).render(),
      'Address resolution statements': new ResolutionStatementViews(this.statement.addressResolutionStatements).render(),
      'Mosaic resolution statements': new ResolutionStatementViews(this.statement.mosaicResolutionStatements).render(),
    }
  }
}
