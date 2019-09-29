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
import {command, ExpectedError, metadata, option} from 'clime';
import {Namespace, NamespaceHttp, NamespaceId, NamespaceService, UInt64} from 'nem2-sdk';
import {OptionsResolver} from '../../options-resolver';
import {ProfileCommand, ProfileOptions} from '../../profile.command';

export class CommandOptions extends ProfileOptions {
    @option({
        flag: 'n',
        description: 'Namespace name. Example: cat.currency',
    })
    name: string;

    @option({
        flag: 'h',
        description: 'Namespace id in hexadecimal. Example: 85BBEA6CC462B244',
    })
    hex: string;
}

export class NamespaceInfoTable {
    private readonly table: HorizontalTable;
    constructor(public readonly namespace: Namespace) {
        this.table = new Table({
            style: {head: ['cyan']},
            head: ['Property', 'Value'],
        }) as HorizontalTable;
        this.table.push(
            ['Id', namespace.id.toHex()],
            ['Name', namespace.name],
            ['Registration Type', namespace.isRoot() ? 'Root Namespace' : 'Sub Namespace'],
            ['Owner', namespace.owner.address.pretty()],
            ['Start Height',  namespace.startHeight.compact()],
            ['End Height', namespace.endHeight.compact()],
        );
        if (namespace.isSubnamespace()) {
            this.table.push(
                ['Parent Id', namespace.parentNamespaceId().toHex()],
            );
        }
        if (namespace.hasAlias()) {
            if (namespace.alias.address) {
                this.table.push(
                    ['Alias Type', 'Address'],
                    ['Alias Address', namespace.alias.address.pretty()],
                );
            } else if (namespace.alias.mosaicId) {
                this.table.push(
                    ['Alias Type', 'MosaicId'],
                    ['Alias MosaicId', namespace.alias.mosaicId.toHex()],
                );
            }
        }
    }

    toString(): string {
        let text = '';
        text += '\n\n' + chalk.green('Namespace Information') + '\n';
        text += this.table.toString();
        return text;
    }
}

@command({
    description: 'Fetch namespace info',
})
export default class extends ProfileCommand {

    constructor() {
        super();
    }

    @metadata
    execute(options: CommandOptions) {
        this.spinner.start();
        const profile = this.getProfile(options);

        if (!options.hex) {
        options.name = OptionsResolver(options,
            'name',
            () => undefined,
            'Introduce the namespace name: ');
        }
        if (options.name === '') {
            options.hex = OptionsResolver(options,
                'uint',
                () => undefined,
                'Introduce the namespace id in hexadecimal: ');
        }

        let namespaceId: NamespaceId;
        if (options.name) {
            namespaceId = new NamespaceId(options.name);
        } else if (options.hex) {
            const namespaceIdUInt64 = UInt64.fromHex(options.hex);
            namespaceId = new NamespaceId([namespaceIdUInt64.lower, namespaceIdUInt64.higher]);
        } else {
            throw new ExpectedError('Introduce a valid namespace name. Example: cat.currency');
        }

        const namespaceHttp = new NamespaceHttp(profile.url);
        const namespaceService = new NamespaceService(namespaceHttp);
        namespaceService.namespace(namespaceId)
            .subscribe((namespace) => {
                this.spinner.stop(true);
                console.log(new NamespaceInfoTable(namespace).toString());
            }, (err) => {
                this.spinner.stop(true);
                let text = '';
                text += chalk.red('Error');
                console.log(text, err.response !== undefined ? err.response.text : err);
            });
    }

}
