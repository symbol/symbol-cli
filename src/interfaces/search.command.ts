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

import { ProfileCommand } from './profile.command';
import { ProfileOptions } from './profile.options';

/**
 * Base command class to search collections.
 */
export abstract class SearchCommand extends ProfileCommand {
    /**
     * Constructor.
     */
    protected constructor() {
        super();
    }
}

/**
 * Search options
 */
export class SearchOptions extends ProfileOptions {
    @option({
        flag: 'o',
        description: '(Optional): Order of transactions. DESC. Newer to older. ASC. Older to newer.',
        default: 'DESC',
    })
    order: string;

    @option({
        flag: 'n',
        description: '(Optional) Filter by page number.',
        default: 1,
    })
    pageSize: number;

    @option({
        flag: 'n',
        description: '(Optional) Number of transactions per page.',
        default: 10,
    })
    pageNumber: number;

    @option({
        flag: 'i',
        description: '(Optional) Database entry id at which to start pagination.',
    })
    offset: string;
}
