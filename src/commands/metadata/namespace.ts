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
import {command, metadata, option} from 'clime';
import {Metadata, MetadataHttp, NamespaceId} from 'nem2-sdk';
import {AnnounceTransactionsCommand, AnnounceTransactionsOptions} from '../../announce.transactions.command';
import {OptionsResolver} from '../../options-resolver';
import {NamespaceIdValidator} from '../../validators/namespaceId.validator';
import {MetadataEntryTable} from './account';

export class CommandOptions extends AnnounceTransactionsOptions {
    @option({
        flag: 'm',
        description: 'Namespace id in hexadecimal format.',
        validator: new NamespaceIdValidator(),
    })
    namespaceId: string;
}

@command({
    description: 'Fetch metadata entries from an namespace',
})
export default class extends AnnounceTransactionsCommand {

    constructor() {
        super();
    }

    @metadata
    execute(options: CommandOptions) {
        this.spinner.start();
        const profile = this.getProfile(options);

        options.namespaceId = OptionsResolver(options,
            'namespaceId',
            () => undefined,
            'Introduce the namespace id in hexadecimal format: ');
        const namespaceId = new NamespaceId(options.namespaceId);

        const metadataHttp = new MetadataHttp(profile.url);
        metadataHttp.getNamespaceMetadata(namespaceId)
            .subscribe((metadataEntries) => {
                this.spinner.stop(true);
                if (metadataEntries.length > 0) {
                    metadataEntries
                        .map((entry: Metadata) => {
                            console.log(new MetadataEntryTable(entry.metadataEntry).toString());
                        });
                } else {
                    console.log('\n The namespaceId does not have metadata entries assigned.');
                }
            }, (err) => {
                this.spinner.stop(true);
                let text = '';
                text += chalk.red('Error');
                console.log(text, err.response !== undefined ? err.response.text : err);
            });
    }
}
