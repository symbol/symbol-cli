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
import {Address, MosaicId, RestrictionHttp} from 'nem2-sdk';
import {AnnounceTransactionsCommand, AnnounceTransactionsOptions} from '../../announce.transactions.command';
import {OptionsResolver} from '../../options-resolver';
import {AddressValidator} from '../../validators/address.validator';
import {MosaicIdValidator} from '../../validators/mosaicId.validator';

export class CommandOptions extends AnnounceTransactionsOptions {
    @option({
        flag: 'a',
        description: 'Account address.',
        validator: new AddressValidator(),
    })
    address: string;

    @option({
        flag: 'm',
        description: 'Mosaic id in hexadecimal format.',
        validator: new MosaicIdValidator(),
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
        text += '\n\n' + chalk.green('Mosaic Address Restrictions') + '\n';
        text += this.table.toString();
        return text;
    }
}

@command({
    description: 'Fetch mosaic restrictions assigned to an address',
})
export default class extends AnnounceTransactionsCommand {

    constructor() {
        super();
    }

    @metadata
    execute(options: CommandOptions) {
        this.spinner.start();
        const profile = this.getProfile(options);

        options.mosaicId = OptionsResolver(options,
            'mosaicId',
            () => undefined,
            'Introduce the mosaic id in hexadecimal format: ');
        const mosaicId = new MosaicId(options.mosaicId);

        options.address =  OptionsResolver(options,
            'address',
            () => this.getProfile(options).account.address.plain(),
            'Introduce an address: ');
        const address = Address.createFromRawAddress(options.address);

        const restrictionHttp = new RestrictionHttp(profile.url);
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
                let text = '';
                text += chalk.red('Error');
                console.log(text, err.response !== undefined ? err.response.text : err);
            });
    }
}
