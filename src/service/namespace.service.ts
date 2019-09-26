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

import chalk from 'chalk';
import * as Table from 'cli-table3';
import {HorizontalTable} from 'cli-table3';
import {Namespace} from 'nem2-sdk';

export class NamespaceCLIService {

    constructor() {

    }

    public formatNamespace(namespace: Namespace) {
        const table = new Table({
            style: {head: ['cyan']},
            head: ['Property', 'Value'],
        }) as HorizontalTable;
        let text = '';
        text += '\n\n' + chalk.green('Namespace Information') + '\n';

        table.push(
            ['Id', namespace.id.toHex()],
            ['Registration Type', namespace.isRoot() ? 'Root Namespace' : 'Sub Namespace'],
            ['Owner', namespace.owner.address.pretty()],
            ['Start Height',  namespace.startHeight.compact()],
            ['End Height', namespace.endHeight.compact()],
        );
        if (namespace.isSubnamespace()) {
            table.push(
                ['Parent Id', 'namespace.parentNamespaceId().toHex()'],
            );
        }
        text += table.toString();
        return text;
    }
}
