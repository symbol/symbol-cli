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

import {Address, NamespaceId} from 'nem2-sdk';

export class RecipientsView {
  /**
   * Renders a recipient or target address to a string to be used in views
   * @static
   * @param {(Address | NamespaceId)} recipient
   * @returns {string}
   */
  static get(recipient: Address | NamespaceId): string {
    return recipient instanceof Address
      ? recipient.pretty()
      : `${recipient.fullName} (${recipient.toHex()})`;
  }
}
