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
import {MosaicIdResolver} from '../../resolvers/mosaic.resolver'
import {HttpErrorHandler} from '../../services/httpErrorHandler.service'
import chalk from 'chalk'
import * as Table from 'cli-table3'
import {HorizontalTable} from 'cli-table3'
import {command, metadata, option} from 'clime'
import {RestrictionMosaicHttp} from 'symbol-sdk'

export class CommandOptions extends ProfileOptions {
    @option({
        flag: 'a',
        description: 'Account address.',
    })
    address: string

    @option({
        flag: 'm',
        description: 'Mosaic id in hexadecimal format.',
    })
    mosaicId: string
}

export class MosaicAddressRestrictionsTable {
    private readonly table: HorizontalTable

    constructor(public readonly mosaicAddressRestrictions:  Map<string, string>) {
        this.table = new Table({
            style: {head: ['cyan']},
            head: ['Type', 'Value'],
        }) as HorizontalTable

        mosaicAddressRestrictions.forEach((value: string, key: string) => {
            this.table.push(
                ['Key', key],
                ['Value', value],
            )
        })
}

    toString(): string {
        let text = ''
        text += '\n' + chalk.green('Mosaic Address Restrictions') + '\n'
        text += this.table.toString()
        return text
    }
}

@command({
    description: 'Fetch mosaic restrictions assigned to an address',
})
export default class extends ProfileCommand {

    constructor() {
        super()
    }

    @metadata
    async execute(options: CommandOptions) {

        const profile = this.getProfile(options)
        const address = await new AddressResolver().resolve(options, profile)
        const mosaicId = await new MosaicIdResolver().resolve(options)

        this.spinner.start()
        const restrictionHttp = new RestrictionMosaicHttp(profile.url)
        restrictionHttp.getMosaicAddressRestriction(mosaicId, address)
            .subscribe((mosaicRestrictions) => {
                this.spinner.stop(true)
                if (mosaicRestrictions.restrictions.size > 0) {
                    console.log(new MosaicAddressRestrictionsTable(mosaicRestrictions.restrictions).toString())
                } else {
                    console.log('\n The address does not have mosaic address restrictions assigned.')
                }
            }, (err) => {
                this.spinner.stop(true)
                console.log(HttpErrorHandler.handleError(err))
            })
    }
}
