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
import {RestrictionMosaicHttp} from 'nem2-sdk';
import {AddressResolver} from '../../resolvers/address.resolver';
import {MosaicIdResolver} from '../../resolvers/mosaic.resolver';
import {ProfileCommand, ProfileOptions} from '../profile.command';

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

    constructor(public readonly mosaicAddressRestrictions:  Map<string, string>) {
        this.table = new Table({
            style: {head: ['cyan']},
            head: ['Type', 'Value'],
        }) as HorizontalTable;

        mosaicAddressRestrictions.forEach((value: string, key: string) => {
            this.table.push(
                ['Key', key],
                ['Value', value],
            );
        });
}

    toString(): string {
        let text = '';
        text += '\n' + chalk.green('Mosaic Address Restrictions') + '\n';
        text += this.table.toString();
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
    execute(options: CommandOptions) {
        this.spinner.start();

        const profile = this.getProfile(options);
        const address = new AddressResolver().resolve(options, profile);
        const mosaicId = new MosaicIdResolver().resolve(options);

        const restrictionHttp = new RestrictionMosaicHttp(profile.url);
        restrictionHttp.getMosaicAddressRestriction(mosaicId, address)
            .subscribe((mosaicRestrictions) => {
                this.spinner.stop(true);
                if (mosaicRestrictions.restrictions.size > 0) {
                    console.log(new MosaicAddressRestrictionsTable(mosaicRestrictions.restrictions).toString());
                } else {
                    console.log('\n The address does not have mosaic address restrictions assigned.');
                }
            }, (err) => {
                this.spinner.stop(true);
                err = err.message ? JSON.parse(err.message) : err;
                console.log(chalk.red('Error'), err.body && err.body.message ? err.body.message : err);
            });
    }
}
