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

import { NamespaceId } from 'symbol-sdk';

export class NamespacesView {
    /**
     * Renders a string to be displayed in the view
     * Renders a namespace name if available (eg: symbol.xym (E74B99BA41F4AFEE))
     * @static
     * @param {NamespaceId} NamespaceId
     * @returns {string}
     */
    static getNamespaceLabel(namespaceId: NamespaceId): string {
        const hexId = namespaceId.toHex();
        if (namespaceId.fullName) {
            return `${namespaceId.fullName} (${hexId})`;
        }
        return hexId;
    }
}
