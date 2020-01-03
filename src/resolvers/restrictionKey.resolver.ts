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
import { KeyGenerator, UInt64 } from 'nem2-sdk';
import { Profile } from '../model/profile';
import { OptionsResolver } from '../options-resolver';
import { ProfileOptions } from '../profile.command';
import { MosaicRestrictionKeyValidator } from '../validators/restrictionKey.validator';
import { Resolver } from './resolver';

export class RestrictionKeyResolver implements Resolver {
    resolve(options: ProfileOptions, secondSource?: Profile, altText?: string): UInt64 {
        const key = OptionsResolver(options,
            'restrictionKey',
            () => undefined,
            altText ? altText : 'Enter the new restriction key: ',
        );
        new MosaicRestrictionKeyValidator().validate(key);
        return KeyGenerator.generateUInt64Key(key);
    }
}
