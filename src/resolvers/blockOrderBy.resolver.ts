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
import { Options } from 'clime';
import { BlockOrderBy } from 'symbol-sdk';

import { OptionsChoiceResolver } from '../options-resolver';
import { BlockOrderByValidator } from '../validators/blockOrderBy.validator';
import { Resolver } from './resolver';

/**
 * Block order by resolver
 */
export class BlockOrderByResolver implements Resolver {
    /**
     * Resolves an block order by value provided by the user.
     * @param {Options} options - Command options.
     * @param {string} altText - Alternative text.
     * @param {string} altKey - Alternative key.
     * @returns {Promise<BlockOrderBy>}
     */
    async resolve(options: Options, altText?: string, altKey?: string): Promise<BlockOrderBy> {
        const choices = [
            {
                title: 'Height',
                value: BlockOrderBy.Height,
            },
            {
                title: 'Id',
                value: BlockOrderBy.Id,
            },
        ];
        const value = await OptionsChoiceResolver(
            options,
            altKey ? altKey : 'orderBy',
            altText ? altText : 'Select a block order by:',
            choices,
            'select',
            new BlockOrderByValidator(),
        );
        return value;
    }
}
