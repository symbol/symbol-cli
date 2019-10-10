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
import {Address, Metadata, MetadataEntry, MetadataHttp} from 'nem2-sdk';
import {OptionsResolver} from '../../options-resolver';
import {ProfileCommand, ProfileOptions} from '../../profile.command';
import {AddressValidator} from '../../validators/address.validator';

export class CommandOptions extends ProfileOptions {
    @option({
        flag: 'a',
        description: 'Account address.',
        validator: new AddressValidator(),
    })
    address: string;
}

export class MetadataEntryTable {
    private readonly table: HorizontalTable;

    constructor(public readonly entry: MetadataEntry) {
        this.table = new Table({
            style: {head: ['cyan']},
            head: ['Type', 'Value'],
        }) as HorizontalTable;

        this.table.push(
            ['Sender Public Key', entry.senderPublicKey],
            ['Target Public Key', entry.targetPublicKey],
            ['Value', entry.value],
        );
        if (entry.targetId) {
            this.table.push(['Target Id', entry.targetId.toHex()]);
        }
    }

    toString(): string {
        let text = '';
        text += '\n\n' + chalk.green('Key:' + this.entry.scopedMetadataKey.toHex()) + '\n';
        text += this.table.toString();
        return text;
    }
}

@command({
    description: 'Fetch metadata entries from an account',
})
export default class extends ProfileCommand {

    constructor() {
        super();
    }

    @metadata
    execute(options: CommandOptions) {
        this.spinner.start();
        const profile = this.getProfile();

        options.address = OptionsResolver(options,
                'address',
                () => profile.account.address.plain(),
                'Introduce an address: ');
        const address = Address.createFromRawAddress(options.address);

        const metadataHttp = new MetadataHttp(profile.url);
        metadataHttp.getAccountMetadata(address)
            .subscribe((metadataEntries) => {
                this.spinner.stop(true);
                if (metadataEntries.length > 0) {
                    metadataEntries
                        .map((entry: Metadata) => {
                            console.log(new MetadataEntryTable(entry.metadataEntry).toString());
                        });
                } else {
                    console.log('\n The address does not have metadata entries assigned.');
                }
            }, (err) => {
                this.spinner.stop(true);
                let text = '';
                text += chalk.red('Error');
                console.log(text, err.response !== undefined ? err.response.text : err);
            });
    }
}
