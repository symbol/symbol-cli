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
import * as Table from 'cli-table3';
import { HorizontalTable } from 'cli-table3';
import { command, metadata, option } from 'clime';
import { MosaicInfo, MosaicService } from 'symbol-sdk';

import { ProfileCommand } from '../../interfaces/profile.command';
import { ProfileOptions } from '../../interfaces/profile.options';
import { MosaicIdResolver } from '../../resolvers/mosaic.resolver';
import { FormatterService } from '../../services/formatter.service';

export class CommandOptions extends ProfileOptions {
    @option({
        flag: 'm',
        description: 'Mosaic id in hexadecimal format.',
    })
    mosaicId: string;
}

export class MosaicViewTable {
    private readonly table: HorizontalTable;
    constructor(public readonly mosaicInfo: MosaicInfo) {
        this.table = new Table({
            style: { head: ['cyan'] },
            head: ['Property', 'Value'],
        }) as HorizontalTable;
        this.table.push(
            ['Record Id', mosaicInfo.recordId],
            ['Mosaic Id', mosaicInfo.id.toHex()],
            ['Divisibility', mosaicInfo.divisibility],
            ['Transferable', mosaicInfo.isTransferable()],
            ['Supply Mutable', mosaicInfo.isSupplyMutable()],
            ['Height', mosaicInfo.startHeight.toString()],
            ['Expiration', mosaicInfo.duration.compact() === 0 ? 'Never' : mosaicInfo.startHeight.add(mosaicInfo.duration).toString()],
            ['Owner', mosaicInfo.ownerAddress.pretty()],
            ['Supply (Absolute)', mosaicInfo.supply.toString()],
            [
                'Supply (Relative)',
                mosaicInfo.divisibility === 0
                    ? mosaicInfo.supply.compact().toLocaleString()
                    : (mosaicInfo.supply.compact() / Math.pow(10, mosaicInfo.divisibility)).toLocaleString(),
            ],
        );
    }

    toString(): string {
        let text = '';
        text += FormatterService.title('Mosaic Information');
        text += '\n' + this.table.toString();
        return text;
    }
}

@command({
    description: 'Fetch mosaic info',
})
export default class extends ProfileCommand {
    constructor() {
        super();
    }

    @metadata
    async execute(options: CommandOptions) {
        const profile = this.getProfile(options);
        const mosaicId = await new MosaicIdResolver().resolve(options);

        this.spinner.start();
        const repositoryFactory = profile.repositoryFactory;
        const accountHttp = repositoryFactory.createAccountRepository();
        const mosaicHttp = repositoryFactory.createMosaicRepository();
        const mosaicService = new MosaicService(accountHttp, mosaicHttp);
        mosaicService.mosaicsView([mosaicId]).subscribe(
            (mosaicViews) => {
                this.spinner.stop();
                if (mosaicViews.length === 0) {
                    console.log(FormatterService.error('No mosaic exists with this id ' + mosaicId.toHex()));
                } else {
                    console.log(new MosaicViewTable(mosaicViews[0].mosaicInfo).toString());
                }
            },
            (err) => {
                this.spinner.stop();
                console.log(FormatterService.error(err));
            },
        );
    }
}
