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

import {Statement} from 'symbol-sdk'
import {HorizontalTable} from 'cli-table3'
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
    console.log(this.render().toString())
  }

  /**
   * @returns {HorizontalTable}
   */
  public render(): HorizontalTable {
    return TableBuilder.renderTableFromArray(this.tableEntries)
  }

  /**
   * The whole CellRecord to render in a table, without empty values
   * @readonly
   * @protected
   * @type {CellRecord}
   */
  private get tableEntries(): CellRecord[] {
    return [
      ...new TransactionStatementViews(this.statement.transactionStatements).render(),
      ...new ResolutionStatementViews(this.statement.addressResolutionStatements).render(),
      ...new ResolutionStatementViews(this.statement.mosaicResolutionStatements).render(),
    ]
  }
}
