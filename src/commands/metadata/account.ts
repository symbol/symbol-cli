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
import {AddressResolver} from '../../resolvers/address.resolver'
import {HttpErrorHandler} from '../../services/httpErrorHandler.service'
import chalk from 'chalk'
import * as Table from 'cli-table3'
import {HorizontalTable} from 'cli-table3'
import {command, metadata, option} from 'clime'
import {Metadata, MetadataEntry, MetadataHttp} from 'symbol-sdk'

export class CommandOptions extends ProfileOptions {
    @option({
        flag: 'a',
        description: 'Account address.',
    })
    address: string
}

export class MetadataEntryTable {
    private readonly table: HorizontalTable

    constructor(public readonly entry: MetadataEntry) {
        this.table = new Table({
            style: {head: ['cyan']},
            head: ['Type', 'Value'],
        }) as HorizontalTable

        this.table.push(
            ['Sender Public Key', entry.senderPublicKey],
            ['Target Public Key', entry.targetPublicKey],
            ['Value', entry.value],
        )
        if (entry.targetId) {
            this.table.push(['Target Id', entry.targetId.toHex()])
        }
    }

    toString(): string {
        let text = ''
        text += '\n' + chalk.green('Key:' + this.entry.scopedMetadataKey.toHex()) + '\n'
        text += this.table.toString()
        return text
    }
}

@command({
    description: 'Fetch metadata entries from an account',
})
export default class extends ProfileCommand {

    constructor() {
        super()
    }

    @metadata
    async execute(options: CommandOptions) {
        const profile = this.getProfile(options)
        const address = await new AddressResolver().resolve(options, profile)

        this.spinner.start()
        const metadataHttp = new MetadataHttp(profile.url)
        metadataHttp.getAccountMetadata(address)
            .subscribe((metadataEntries) => {
                this.spinner.stop(true)
                if (metadataEntries.length > 0) {
                    metadataEntries
                        .map((entry: Metadata) => {
                            console.log(new MetadataEntryTable(entry.metadataEntry).toString())
                        })
                } else {
                    console.log('\n The address does not have metadata entries assigned.')
                }
            }, (err) => {
                this.spinner.stop(true)
                console.log(HttpErrorHandler.handleError(err))
            })
    }
}
