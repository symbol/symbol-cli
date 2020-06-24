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
import { CreateProfileOptions } from '../interfaces/create.profile.options';
import { OptionsConfirmResolver } from '../options-resolver';
import { Resolver } from './resolver';

/**
 * Default resolver
 */
export class DefaultResolver implements Resolver {
    /**
     * Resolves if an account has to be set as default.
     * @param {CreateProfileOptions} options - Command options.
     * @param {string} altText - Alternative text.
     * @returns {Promise<boolean>}
     */
    async resolve(options: CreateProfileOptions, altText?: string): Promise<boolean> {
        if (
            await OptionsConfirmResolver(options, 'default', altText ? altText : 'Do you want to set the account as the default profile?')
        ) {
            options.default = true;
        }
        return options.default;
    }
}
