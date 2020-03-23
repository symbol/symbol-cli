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
import {statement} from '../../mocks/statements.mock'
import {assert, expect} from 'chai'
import {TransactionStatementViews} from '../../../src/views/statements/transactionStatements.view'

describe('Transaction Statement Views', () => {
 it('Renders transaction statements', () => {
  const statementsView: any[] = new TransactionStatementViews(statement.transactionStatements).render()
  assert.typeOf(statementsView, 'array', 'statementsView.render is an array')

  expect(statementsView[0].title.content).equal('Transaction statements')
  expect(statementsView[1].title.content).equal('Transaction statement 1 of 1')
  expect(statementsView[2]).deep.equal({ height: 1 })
  expect(statementsView[3]).deep.equal({ source: 'Primary Id: 1, Secondary Id: 2' })
  expect(statementsView[4].title.content).equal('Transaction receipts')

  expect(statementsView[5].title.content).equal('Receipt 1 of 4')
  expect(statementsView[6]).deep.equal({ type: 'Harvest_Fee' })
  expect(statementsView[7]).deep.equal({ size: 'N/A' })
  expect(statementsView[8]).deep.equal({ 'Target account': 'NAHTHI-O4LNIL-5UUCJD-S4JM5G-CCIHXP-SDLDSV-RI53' })
  expect(statementsView[9]).deep.equal({ MosaicId: 'D525AD41D95FCF29' })
  expect(statementsView[10]).deep.equal({ Amount: 10 })

  expect(statementsView[11].title.content).equal('Receipt 2 of 4')
  expect(statementsView[12]).deep.equal({ type: 'Transaction_Group' })
  expect(statementsView[13]).deep.equal({ size: 'N/A' })
  expect(statementsView[14]).deep.equal({ Sender: 'NAHTHI-O4LNIL-5UUCJD-S4JM5G-CCIHXP-SDLDSV-RI53' })
  expect(statementsView[15]).deep.equal({ Recipient: 'NCKQSD-7ORC23-AYGKZB-DHS2TL-3UVYAB-6EWQXL-EDI6' })
  expect(statementsView[16]).deep.equal({ 'Mosaic Id': 'D525AD41D95FCF29' })
  expect(statementsView[17]).deep.equal({ Amount: 2 })

  expect(statementsView[18].title.content).equal('Receipt 3 of 4')
  expect(statementsView[19]).deep.equal({ type: 'Namespace_Expired' })
  expect(statementsView[20]).deep.equal({ size: 'N/A' })
  expect(statementsView[21]).deep.equal({ 'Namespace Id': 'E74B99BA41F4AFEE' })

  expect(statementsView[22].title.content).equal('Receipt 4 of 4')
  expect(statementsView[23]).deep.equal({ type: 'Inflation' })
  expect(statementsView[24]).deep.equal({ size: 100 })
  expect(statementsView[25]).deep.equal({ MosaicId: 'D525AD41D95FCF29' })
  expect(statementsView[26]).deep.equal({ Amount: 100 })
 })
})
