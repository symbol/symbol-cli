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
import { BlockSearchCriteria } from 'symbol-sdk/dist/src/infrastructure/searchCriteria/BlockSearchCriteria';
import { SearchCommand } from '../../interfaces/search.command';
import { SearchOptions } from '../../interfaces/search.options';
import { AddressResolver } from '../../resolvers/address.resolver';
import { BlockOrderByResolver } from '../../resolvers/blockOrderBy.resolver';
import { PublicKeyResolver } from '../../resolvers/publicKey.resolver';
import { FormatterService } from '../../services/formatter.service';
import { BlockHeaderTable } from './info';

/**
 * Search options
 */
export class BlockSearchOptions extends SearchOptions {
    @option({
        description: '(Optional) Public key of the account signing the entity.',
    })
    signerPublicKey: string;

    @option({
        description: '(Optional) Filter by beneficiary address.',
    })
    beneficiaryAddress: string;

    @option({
        description: '(Optional) Order by (Id, Height).',
        default: 'Id',
    })
    orderBy: string;

    async buildSearchCriteria(): Promise<BlockSearchCriteria> {
        const criteria: BlockSearchCriteria = {
            ...(await this.buildBaseSearchCriteria()),
            orderBy: await new BlockOrderByResolver().resolve(this),
        };
        if (this.signerPublicKey) {
            criteria.signerPublicKey = (await new PublicKeyResolver().resolve(this, undefined, undefined, 'signerPublicKey')).publicKey;
        }
        if (this.beneficiaryAddress) {
            criteria.beneficiaryAddress = (await new AddressResolver().resolve(this, undefined, undefined, 'beneficiaryAddress')).plain();
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
    async execute(options: BlockSearchOptions) {
        const profile = this.getProfile(options);

        this.spinner.start();
        const blockHttp = profile.repositoryFactory.createBlockRepository();
        blockHttp.search(await options.buildSearchCriteria()).subscribe(
            (page) => {
                this.spinner.stop();

                if (!page.data.length) {
                    console.log(FormatterService.error('No data found; try changing the selection criteria'));
                }

                page.data.forEach((block) => {
                    console.log(new BlockHeaderTable(block).toString());
                });
            },
            (err) => {
                this.spinner.stop();
                console.log(FormatterService.error(err));
            },
        );
    }
}
