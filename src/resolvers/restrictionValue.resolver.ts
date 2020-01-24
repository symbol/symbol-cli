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
import {ProfileOptions} from '../commands/profile.command';
import {Profile} from '../models/profile';
import {OptionsResolver} from '../options-resolver';
import {NumericStringValidator} from '../validators/numericString.validator';
import {Resolver} from './resolver';

/**
 * Restriction value resolver
 */
export class RestrictionValueResolver implements Resolver {

    /**
     * Resolve a restriction value provided by a user.
     * @param {ProfileOptions} options - Command options.
     * @param {Profile} secondSource - Secondary data source.
     * @param {string} altText - Alternative text.
     * @param {string} altKey - Alternative key.
     * @return {string}
     */
    resolve(options: ProfileOptions, secondSource?: Profile, altText?: string, altKey?: string): string {
        const value = OptionsResolver(options,
            altKey ? altKey : 'newRestrictionValue',
            () => undefined,
            altText ? altText : 'Enter new restriction value: ',
        );
        new NumericStringValidator().validate(value);
        return value;
    }
}
