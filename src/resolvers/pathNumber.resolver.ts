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
import {Options} from 'clime'

import {OptionsChoiceResolver} from '../options-resolver'
import {Resolver} from './resolver'

/**
 * Path number resolver
 */
export class PathNumberResolver implements Resolver {

    /**
     * Resolves a path number provided by the user.
     * @returns {Promise<number>}
     */
    async resolve(options: Options): Promise<number> {
        const choices = [...Array(10).keys()]
            .map((key) => ({
                // Index is shown as 1-based to match with other wallets UX
                title: `${key+ 1}`,
                value: key,
            }))

        const value = +(await OptionsChoiceResolver(
            options,
            'pathNumber',
            'Select the child account number:',
            choices,
            'select',
            undefined,
        ))
        return value
    }
}
