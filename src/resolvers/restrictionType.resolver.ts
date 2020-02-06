/*
 *
 * Copyright 2018-present NEM
 *
 * Licensed under the Apache License, Version 2.0 (the "License")
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
import chalk from 'chalk'
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
     * @param {string} altKey - Alternative key.
     * @return {number}
     */
    async resolve(options: ProfileOptions, secondSource?: Profile, altText?: string, altKey?: string): Promise<number> {
        const choices = [
            {title: 'NONE', value: 0},
            {title: 'EQ', value: 1},
            {title: 'NE', value: 2},
            {title: 'LT', value: 3},
            {title: 'LE', value: 4},
            {title: 'GT', value: 5},
            {title: 'GE', value: 6},

        ]
        const index = +(await OptionsChoiceResolver(options,
            altKey ? altKey : 'newRestrictionType',
            altText ? altText : 'Select the new restriction type: ',
            choices,
        ))
        let restrictionName
        if (isNumeric(index)) {
            restrictionName = choices[+index] as any
        } else {
            restrictionName = index
        }
        try {
            new MosaicRestrictionTypeValidator().validate(restrictionName)
        } catch (err) {
            console.log(chalk.red('ERR'), err)
            return process.exit()
        }
        return parseInt(MosaicRestrictionType[restrictionName], 10)
    }
}
