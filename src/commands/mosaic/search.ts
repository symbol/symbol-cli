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
import { MosaicSearchCriteria } from 'symbol-sdk/dist/src/infrastructure/searchCriteria/MosaicSearchCriteria';

import { SearchCommand } from '../../interfaces/search.command';
import { SearchOptions } from '../../interfaces/search.options';
import { AddressResolver } from '../../resolvers/address.resolver';
import { FormatterService } from '../../services/formatter.service';
import { MosaicViewTable } from './info';

/**
 * Search options
 */
export class MosaicSearchOptions extends SearchOptions {
    @option({
        description: '(Optional) Filter by owner address.',
    })
    ownerAddress: string;

    async buildSearchCriteria(): Promise<MosaicSearchCriteria> {
        const criteria: MosaicSearchCriteria = await this.buildBaseSearchCriteria();
        if (this.ownerAddress) {
            criteria.ownerAddress = await new AddressResolver().resolve(this, undefined, undefined, 'ownerAddress');
        }
        return criteria;
    }
}

@command({
    description: 'Search transactions',
})
export default class extends SearchCommand {
    constructor() {
        super();
    }

    @metadata
    async execute(options: MosaicSearchOptions) {
        const profile = this.getProfile(options);

        this.spinner.start();
        const mosaicHttp = profile.repositoryFactory.createMosaicRepository();
        mosaicHttp.search(await options.buildSearchCriteria()).subscribe(
            (page) => {
                this.spinner.stop();

                if (!page.data.length) {
                    console.log(FormatterService.error('No data found; try changing the selection criteria'));
                }

                page.data.forEach((mosaic) => {
                    console.log(new MosaicViewTable(mosaic).toString());
                });
            },
            (err) => {
                this.spinner.stop();
                console.log(FormatterService.error(err));
            },
        );
    }
}
