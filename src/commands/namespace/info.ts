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
import {ProfileCommand} from '../../interfaces/profile.command'
import {ProfileOptions} from '../../interfaces/profile.options'
import {NamespaceIdResolver, NamespaceNameResolver} from '../../resolvers/namespace.resolver'
import {HttpErrorHandler} from '../../services/httpErrorHandler.service'
import chalk from 'chalk'
import * as Table from 'cli-table3'
import {HorizontalTable} from 'cli-table3'
import {command, metadata, option} from 'clime'
import {NamespaceHttp, NamespaceInfo} from 'symbol-sdk'

export class CommandOptions extends ProfileOptions {
    @option({
        flag: 'n',
        description: 'Namespace name. Example: symbol.xym',
    })
    namespaceName: string

    @option({
        flag: 'h',
        description: 'Namespace id in hexadecimal.',
    })
    namespaceId: string
}

export class NamespaceInfoTable {
    private readonly table: HorizontalTable
    constructor(public readonly namespaceInfo: NamespaceInfo) {
        this.table = new Table({
            style: {head: ['cyan']},
            head: ['Property', 'Value'],
        }) as HorizontalTable
        this.table.push(
            ['Id', namespaceInfo.id.toHex()],
            ['Registration Type', namespaceInfo.isRoot() ? 'Root Namespace' : 'Sub Namespace'],
            ['Owner', namespaceInfo.owner.address.pretty()],
            ['Start Height',  namespaceInfo.startHeight.toString()],
            ['End Height', namespaceInfo.endHeight.toString()],
        )
        if (namespaceInfo.isSubnamespace()) {
            this.table.push(
                ['Parent Id', namespaceInfo.parentNamespaceId().toHex()],
            )
        }
        if (namespaceInfo.hasAlias()) {
            if (namespaceInfo.alias.address) {
                this.table.push(
                    ['Alias Type', 'Address'],
                    ['Alias Address', namespaceInfo.alias.address.pretty()],
                )
            } else if (namespaceInfo.alias.mosaicId) {
                this.table.push(
                    ['Alias Type', 'MosaicId'],
                    ['Alias MosaicId', namespaceInfo.alias.mosaicId.toHex()],
                )
            }
        }
    }

    toString(): string {
        let text = ''
        text += '\n' + chalk.green('Namespace Information') + '\n'
        text += this.table.toString()
        return text
    }
}

@command({
    description: 'Fetch namespace info',
})
export default class extends ProfileCommand {

    constructor() {
        super()
    }

    @metadata
    async execute(options: CommandOptions) {
        const profile = this.getProfile(options)
        const namespaceId = options.namespaceName ?
        await new NamespaceNameResolver().resolve(options) :
        await new NamespaceIdResolver().resolve(options)

        this.spinner.start()
        const namespaceHttp = new NamespaceHttp(profile.url)
        namespaceHttp.getNamespace(namespaceId)
            .subscribe((namespaceInfo) => {
                this.spinner.stop(true)
                console.log(new NamespaceInfoTable(namespaceInfo).toString())
            }, (err) => {
                this.spinner.stop(true)
                console.log(HttpErrorHandler.handleError(err))
            })
    }
}
