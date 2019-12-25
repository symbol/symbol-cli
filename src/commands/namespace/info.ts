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
import {command, metadata, option} from 'clime';
import {NamespaceHttp, NamespaceId, NamespaceInfo, UInt64} from 'nem2-sdk';
import {OptionsResolver} from '../../options-resolver';
import {ProfileCommand, ProfileOptions} from '../../profile.command';
import {NamespaceIdValidator} from '../../validators/namespaceId.validator';

export class CommandOptions extends ProfileOptions {
    @option({
        flag: 'n',
        description: 'Namespace name. Example: cat.currency',
    })
    name: string;

    @option({
        flag: 'h',
        description: 'Namespace id in hexadecimal.',
        validator: new NamespaceIdValidator(),
    })
    hex: string;
}

export class NamespaceInfoTable {
    private readonly table: HorizontalTable;
    constructor(public readonly namespaceInfo: NamespaceInfo) {
        this.table = new Table({
            style: {head: ['cyan']},
            head: ['Property', 'Value'],
        }) as HorizontalTable;
        this.table.push(
            ['Id', namespaceInfo.id.toHex()],
            ['Registration Type', namespaceInfo.isRoot() ? 'Root Namespace' : 'Sub Namespace'],
            ['Owner', namespaceInfo.owner.address.pretty()],
            ['Start Height',  namespaceInfo.startHeight.compact()],
            ['End Height', namespaceInfo.endHeight.compact()],
        );
        if (namespaceInfo.isSubnamespace()) {
            this.table.push(
                ['Parent Id', namespaceInfo.parentNamespaceId().toHex()],
            );
        }
        if (namespaceInfo.hasAlias()) {
            if (namespaceInfo.alias.address) {
                this.table.push(
                    ['Alias Type', 'Address'],
                    ['Alias Address', namespaceInfo.alias.address.pretty()],
                );
            } else if (namespaceInfo.alias.mosaicId) {
                this.table.push(
                    ['Alias Type', 'MosaicId'],
                    ['Alias MosaicId', namespaceInfo.alias.mosaicId.toHex()],
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

        let namespaceId: NamespaceId;
        if (options.name) {
            options.name = OptionsResolver(options,
                'name',
                () => undefined,
                'Enter the namespace name: ');
            namespaceId = new NamespaceId(options.name);
        } else {
            options.hex = OptionsResolver(options,
                'hex',
                () => undefined,
                'Enter the namespace id in hexadecimal: ');
            const namespaceIdUInt64 = UInt64.fromHex(options.hex);
            namespaceId = new NamespaceId([namespaceIdUInt64.lower, namespaceIdUInt64.higher]);
        }

        const namespaceHttp = new NamespaceHttp(profile.url);
        namespaceHttp.getNamespace(namespaceId)
            .subscribe((namespaceInfo) => {
                this.spinner.stop(true);
                console.log(new NamespaceInfoTable(namespaceInfo).toString());
            }, (err) => {
                this.spinner.stop(true);
                let text = '';
                text += chalk.red('Error');
                console.log(text, err.response !== undefined ? err.response.text : err);
            });
    }
}
