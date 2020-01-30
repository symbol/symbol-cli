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
import {MosaicRestrictionType} from 'nem2-sdk'
import {isNumeric} from 'rxjs/internal-compatibility'
import {ProfileOptions} from '../interfaces/profile.command'
import {Profile} from '../models/profile'
import {OptionsChoiceResolver} from '../options-resolver'
import {MosaicRestrictionTypeValidator} from '../validators/restrictionType.validator'
import {Resolver} from './resolver'

/**
 * Restriction type resolver
 */
export class RestrictionTypeResolver implements Resolver {
    /**
     * Resolve a restriction type provided by a user.
     * @param {ProfileOptions} options - Command options.
     * @param {Profile} secondSource - Secondary data source.
     * @param {string} altText - Alternative text.
     * @return {number}
     */
    resolve(options: ProfileOptions, secondSource?: Profile, altText?: string): number {
        const choices = ['NONE', 'EQ', 'NE', 'LT', 'LE', 'GT', 'GE']
        const index = OptionsChoiceResolver(options,
            'newRestrictionType',
            altText ? altText : 'Select the new restriction type: ',
            choices,
        )
        let restrictionName
        if (isNumeric(index)) {
            restrictionName = choices[+index] as any
        } else {
            restrictionName = index
        }
        new MosaicRestrictionTypeValidator().validate(restrictionName)
        return parseInt(MosaicRestrictionType[restrictionName], 10)
    }
}
