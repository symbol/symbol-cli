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
import { from } from 'rxjs';
import { filter, map, mergeMap, toArray } from 'rxjs/operators';
import { MosaicAddressRestriction, MosaicAddressRestrictionItem } from 'symbol-sdk';
import { ProfileCommand } from '../../interfaces/profile.command';
import { ProfileOptions } from '../../interfaces/profile.options';
import { AddressResolver } from '../../resolvers/address.resolver';
import { MosaicIdResolver } from '../../resolvers/mosaic.resolver';
import { FormatterService } from '../../services/formatter.service';

export class CommandOptions extends ProfileOptions {
    @option({
        flag: 'a',
        description: 'Account address.',
    })
    address: string;

    @option({
        flag: 'm',
        description: 'Mosaic id in hexadecimal format.',
    })
    mosaicId: string;
}

export class MosaicAddressRestrictionsTable {
    private readonly table: HorizontalTable;

    constructor(public readonly mosaicAddressRestrictions: MosaicAddressRestriction[]) {
        this.table = new Table({
            style: { head: ['cyan'] },
            head: ['Type', 'Value'],
        }) as HorizontalTable;

        mosaicAddressRestrictions.forEach((mosaicRestriction) => {
            mosaicRestriction.restrictions.forEach((value: MosaicAddressRestrictionItem) => {
                this.table.push(['Key', value.key.toString()], ['Value', value.restrictionValue.toString()]);
            });
        });
    }

    toString(): string {
        let text = '';
        text += FormatterService.title('Mosaic Address Restrictions');
        text += '\n' + this.table.toString();
        return text;
    }
}

@command({
    description: 'Fetch mosaic restrictions assigned to an address',
})
export default class extends ProfileCommand {
    constructor() {
        super();
    }

    @metadata
    async execute(options: CommandOptions) {
        const profile = this.getProfile(options);
        const address = await new AddressResolver().resolve(options, profile);
        const mosaicId = await new MosaicIdResolver().resolve(options);

        this.spinner.start();
        const restrictionHttp = profile.repositoryFactory.createRestrictionMosaicRepository();

        // Should we load all?
        const criteria = { mosaicId, targetAddress: address };

        const observable = restrictionHttp.searchMosaicRestrictions(criteria).pipe(
            mergeMap((page) => {
                return from(page.data);
            }),
            filter((m) => m instanceof MosaicAddressRestriction),
            map((m) => m as MosaicAddressRestriction),
            toArray(),
        );

        observable.subscribe(
            (mosaicRestrictions: MosaicAddressRestriction[]) => {
                this.spinner.stop();
                if (mosaicRestrictions.length > 0) {
                    console.log(new MosaicAddressRestrictionsTable(mosaicRestrictions).toString());
                } else {
                    console.log(FormatterService.error('The address does not have mosaic address restrictions assigned'));
                }
            },
            (err: any) => {
                this.spinner.stop();
                console.log(FormatterService.error(err));
            },
        );
    }
}
