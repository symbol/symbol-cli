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
import {Address, Metadata, MetadataHttp} from 'nem2-sdk';
import {AnnounceTransactionsCommand, AnnounceTransactionsOptions} from '../../announce.transactions.command';
import {OptionsResolver} from '../../options-resolver';
import {AddressValidator} from '../../validators/address.validator';

export class CommandOptions extends AnnounceTransactionsOptions {
    @option({
        flag: 'a',
        description: 'Account address.',
        validator: new AddressValidator(),
    })
    address: string;
}

export class MetadataTable {
    private readonly table: HorizontalTable;

    constructor(public readonly metadataArray: Metadata[]) {
        this.table = new Table({
            style: {head: ['cyan']},
            head: ['Type', 'Value'],
        }) as HorizontalTable;

        metadataArray
            .map((entry: Metadata) => {
                this.table.push(
                    ['Sender Public Key', entry.metadataEntry.senderPublicKey],
                    ['Target Public Key', entry.metadataEntry.targetPublicKey],
                    ['Scoped Metadata Key', entry.metadataEntry.scopedMetadataKey.toHex()],
                    ['Value', entry.metadataEntry.value],
                );
                if (entry.metadataEntry.targetId) {
                    this.table.push(['Target Id', entry.metadataEntry.targetId.toHex()]);
                }
            });
    }

    toString(): string {
        let text = '';
        text += '\n\n' + chalk.green('Metadata') + '\n';
        text += this.table.toString();
        return text;
    }
}

@command({
    description: 'Fetch metadata entries from an account',
})
export default class extends AnnounceTransactionsCommand {

    constructor() {
        super();
    }

    @metadata
    execute(options: CommandOptions) {
        this.spinner.start();
        const profile = this.getProfile(options);

        options.address = OptionsResolver(options,
                'address',
                () => this.getProfile(options).account.address.plain(),
                'Introduce an address: ');
        const address = Address.createFromRawAddress(options.address);

        const metadataHttp = new MetadataHttp(profile.url);
        metadataHttp.getAccountMetadata(address)
            .subscribe((metadataEntries) => {
                this.spinner.stop(true);
                if (metadata.length > 0) {
                    console.log(new MetadataTable(metadataEntries).toString());
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
