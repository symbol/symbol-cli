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
import {MosaicIdResolver} from '../../resolvers/mosaic.resolver'
import {HttpErrorHandler} from '../../services/httpErrorHandler.service'
import chalk from 'chalk'
import * as Table from 'cli-table3'
import {HorizontalTable} from 'cli-table3'
import {command, metadata, option} from 'clime'
import {AccountHttp, MosaicHttp, MosaicService, MosaicView} from 'symbol-sdk'

export class CommandOptions extends ProfileOptions {
    @option({
        flag: 'm',
        description: 'Mosaic id in hexadecimal format.',
    })
    mosaicId: string
}

export class MosaicViewTable {
    private readonly table: HorizontalTable
    constructor(public readonly mosaicView: MosaicView) {
        this.table = new Table({
            style: {head: ['cyan']},
            head: ['Property', 'Value'],
        }) as HorizontalTable
        this.table.push(
            ['Id', mosaicView.mosaicInfo.id.toHex()],
            ['Divisibility', mosaicView.mosaicInfo.divisibility],
            ['Transferable', mosaicView.mosaicInfo.isTransferable()],
            ['Supply Mutable',  mosaicView.mosaicInfo.isSupplyMutable()],
            ['Height', mosaicView.mosaicInfo.height.toString()],
            ['Expiration', mosaicView.mosaicInfo.duration.compact() === 0 ?
                'Never' : (mosaicView.mosaicInfo.height.add(mosaicView.mosaicInfo.duration)).toString()],
            ['Owner', mosaicView.mosaicInfo.owner.address.pretty()],
            ['Supply (Absolute)', mosaicView.mosaicInfo.supply.toString()],
            ['Supply (Relative)', mosaicView.mosaicInfo.divisibility === 0 ? mosaicView.mosaicInfo.supply.compact().toLocaleString()
                : (mosaicView.mosaicInfo.supply.compact() / Math.pow(10, mosaicView.mosaicInfo.divisibility)).toLocaleString()],
        )
    }

    toString(): string {
        let text = ''
        text += '\n' + chalk.green('Mosaic Information') + '\n'
        text += this.table.toString()
        return text
    }
}

@command({
    description: 'Fetch mosaic info',
})
export default class extends ProfileCommand {

    constructor() {
        super()
    }

    @metadata
    async execute(options: CommandOptions) {
        const profile = this.getProfile(options)
        const mosaicId = await new MosaicIdResolver().resolve(options)

        this.spinner.start()
        const mosaicService = new MosaicService(
            new AccountHttp(profile.url),
            new MosaicHttp(profile.url),
        )
        mosaicService.mosaicsView([mosaicId])
            .subscribe((mosaicViews) => {
                this.spinner.stop(true)
                if (mosaicViews.length === 0) {
                    console.log('No mosaic exists with this id ' + mosaicId.toHex())
                } else {
                    console.log(new MosaicViewTable(mosaicViews[0]).toString())
                }
            }, (err) => {
                this.spinner.stop(true)
                console.log(HttpErrorHandler.handleError(err))
            })
    }

}
