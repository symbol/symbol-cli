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
import {ResolutionStatementViews} from '../../../src/views/statements/resolutionStatements.view'

describe('Resolution Statement Views', () => {
 it('Renders a mosaic resolution statements', () => {
  const statementsView: any[][] | null = new ResolutionStatementViews(statement.mosaicResolutionStatements).render()
  if (statementsView === null) { throw new Error('statementsView should be defined') }

  assert.typeOf(statementsView, 'array', 'statementsView.render is an array')

  expect(statementsView[0][0].title.content).equal('Mosaic statement 1 of 1')
  expect(statementsView[0][1]).deep.equal({ Height: 1 })
  expect(statementsView[0][2]).deep.equal({ Unresolved: 'D525AD41D95FCF29' })
  expect(statementsView[0][3].title.content).equal('Resolution 1 of 2')
  expect(statementsView[0][4]).deep.equal({ Resolved: 'CAF5DD1286D7CC4C' })
  expect(statementsView[0][5]).deep.equal({ Source: 'Primary Id: 1, Secondary Id: 0' })
  expect(statementsView[0][6].title.content).equal('Resolution 2 of 2')
  expect(statementsView[0][7]).deep.equal({ Resolved: '504677C3281108DB' })
  expect(statementsView[0][8]).deep.equal({ Source: 'Primary Id: 3, Secondary Id: 5' })
 })

 it('Renders an address resolution statements', () => {
  const statementsView: any[][] | null = new ResolutionStatementViews(statement.addressResolutionStatements).render()
  if (statementsView === null) { throw new Error('statementsView should be defined') }
  assert.typeOf(statementsView, 'array', 'statementsView.render is an array')

  expect(statementsView[0][0].title.content).equal('Address statement 1 of 1')
  expect(statementsView[0][1]).deep.equal({ Height: 2 })
  expect(statementsView[0][2]).deep.equal({ Unresolved: 'NCWYXK-VYBMO4-NBCUF3-AXKJMX-CGVSYQ-OS72UN-KD3F' })
  expect(statementsView[0][3].title.content).equal('Resolution 1 of 1')
  expect(statementsView[0][4]).deep.equal({ Resolved: 'CAF5DD1286D7CC4C' })
  expect(statementsView[0][5]).deep.equal({ Source: 'Primary Id: 5, Secondary Id: 0' })
 })
})
