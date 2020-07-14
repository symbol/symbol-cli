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
import { option } from 'clime';
import { SearchCriteria } from 'symbol-sdk';

import { OffsetResolver } from '../resolvers/offset.resolver';
import { OrderResolver } from '../resolvers/order.resolver';
import { PageNumberResolver } from '../resolvers/pageNumber.resolver';
import { PageSizeResolver } from '../resolvers/pageSize.resolver';
import { ProfileOptions } from './profile.options';

/**
 * Search options
 */
export class SearchOptions extends ProfileOptions {
    @option({
        flag: 'o',
        description: '(Optional): Sort entries. (Desc: Newer to older, Asc: Older to newer)',
        default: 'Desc',
    })
    order: string;

    @option({
        flag: 'n',
        description: '(Optional) Number of entries per page.',
        default: 10,
    })
    pageSize: number;

    @option({
        flag: 'n',
        description: '(Optional) Filter by page number.',
        default: 1,
    })
    pageNumber: number;

    @option({
        flag: 'i',
        description: '(Optional) Database entry id at which to start pagination.',
    })
    offset: string;

    protected async buildBaseSearchCriteria(): Promise<SearchCriteria> {
        const criteria: SearchCriteria = {
            order: await new OrderResolver().resolve(this),
            pageSize: await new PageSizeResolver().resolve(this),
            pageNumber: await new PageNumberResolver().resolve(this),
        };
        if (this.offset) {
            criteria.offset = await new OffsetResolver().resolve(this);
        }
        return criteria;
    }
}
