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

import {CellRecord} from '../transactions/details/transaction.view'

export abstract class AbstractStatementView {
 /**
 * Renders a section header
 * @private
 * @param {string} sectionName
 * @returns {CellRecord}
 */
 protected getSectionTitle(sectionName: string): CellRecord {
  return {
   title: {content: sectionName, colSpan: 2, hAlign: 'left'},
  }
 }

 public render() {
  throw new Error('The render class must be overriden by implementation classes')
 }
}
