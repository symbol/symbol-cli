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
import {StatementsView} from '../../../src/views/statements/statements.view'
import {assert} from 'chai'

describe('Statements view', () => {
 it('Renders statements', () => {
  const statementsView = new StatementsView(statement).tableEntries
  if (statementsView['Transaction statements'] === null
   || statementsView['Address resolution statements'] === null
   || statementsView['Mosaic resolution statements'] === null) {
   throw new Error('Something went wrong when rendering the statements tables')
  }

  statementsView['Transaction statements'].forEach(
   (element) => assert.typeOf(element, 'array', 'statementsView.render is an array')
  )
  statementsView['Address resolution statements'].forEach(
   (element) => assert.typeOf(element, 'array', 'statementsView.render is an array')
  )
  statementsView['Mosaic resolution statements'].forEach(
   (element) => assert.typeOf(element, 'array', 'statementsView.render is an array')
  )
 })
})
