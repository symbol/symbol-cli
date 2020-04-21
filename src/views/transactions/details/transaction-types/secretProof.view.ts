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

import {RecipientsView} from '../../../recipients.view'
import {CellRecord} from '../transaction.view'
import {LockHashAlgorithm, SecretProofTransaction} from 'symbol-sdk'

export class SecretProofView {
  /**
   * @static
   * @param {SecretProofTransaction} tx
   * @returns {CellRecord}
   */
  static get(tx: SecretProofTransaction): CellRecord {
    return {
      'Recipient': RecipientsView.get(tx.recipientAddress),
      'Hash type': LockHashAlgorithm[tx.hashAlgorithm],
      'Secret': tx.secret,
      'Proof': tx.proof,
    }
  }
}
