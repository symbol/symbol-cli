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
import { MosaicRestrictionType } from 'nem2-sdk';
import { isNumeric } from 'rxjs/internal-compatibility';
import { Profile } from '../model/profile';
import { OptionsChoiceResolver } from '../options-resolver';
import { ProfileOptions } from '../profile.command';
import { MosaicRestrictionTypeValidator } from '../validators/restrictionType.validator';
import { Resolver } from './resolver';

export class RestrictionTypeResolver implements Resolver {
    resolve(options: ProfileOptions, secondSource?: Profile, altText?: string): any {
        const choices = ['NONE', 'EQ', 'NE', 'LT', 'LE', 'GT', 'GE'];
        const index = OptionsChoiceResolver(options,
            'newRestrictionType',
            altText ? altText : 'Select the new restriction type: ',
            choices,
        );
        let restrictionName;
        if (isNumeric(index)) {
            restrictionName = choices[+index] as any;
        } else {
            restrictionName = index;
        }
        new MosaicRestrictionTypeValidator().validate(restrictionName);
        return MosaicRestrictionType[restrictionName];
    }

    optionalResolve(options: any, altKey?: string, defaultValue?: any): MosaicRestrictionType {
        const key = altKey ? altKey : 'previousRestrictionType';
        if (defaultValue) {
            options[key] = options[key] ? options[key] : defaultValue;
        }
        new MosaicRestrictionTypeValidator().validate(options[key]);
        return Number(MosaicRestrictionType[options[key] as any]) as MosaicRestrictionType;
    }
}
