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
import { command, metadata, option } from 'clime';
import { Metadata } from 'symbol-sdk';

import { ProfileCommand } from '../../interfaces/profile.command';
import { ProfileOptions } from '../../interfaces/profile.options';
import { MosaicIdResolver } from '../../resolvers/mosaic.resolver';
import { FormatterService } from '../../services/formatter.service';
import { MetadataEntryTable } from './account';

export class CommandOptions extends ProfileOptions {
    @option({
        flag: 'm',
        description: 'Mosaic id in hexadecimal format.',
    })
    mosaicId: string;
}

@command({
    description: 'Fetch metadata entries from an mosaic',
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
        const metadataHttp = profile.repositoryFactory.createMetadataRepository();
        metadataHttp.getMosaicMetadata(mosaicId).subscribe(
            (metadataEntries) => {
                this.spinner.stop(true);
                if (metadataEntries.length > 0) {
                    metadataEntries.map((entry: Metadata) => {
                        console.log(new MetadataEntryTable(entry.metadataEntry).toString());
                    });
                } else {
                    console.log(FormatterService.error('The mosaic does not have metadata entries assigned'));
                }
            },
            (err) => {
                this.spinner.stop(true);
                console.log(FormatterService.error(err));
            },
        );
    }
}
