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

import {AccountRestrictionFlags, MosaicRestrictionType} from 'nem2-sdk';

export class RestrictionService {
    constructor() {

    }

    public static getMosaicRestrictionType(type: string): MosaicRestrictionType {
        let restrictionType;
        switch (type) {
            case 'NONE': restrictionType = MosaicRestrictionType.NONE; break;
            case 'EQ': restrictionType = MosaicRestrictionType.EQ; break;
            case 'NE': restrictionType = MosaicRestrictionType.NE; break;
            case 'LT': restrictionType = MosaicRestrictionType.LT; break;
            case 'LE': restrictionType = MosaicRestrictionType.LE; break;
            case 'GT': restrictionType = MosaicRestrictionType.GT; break;
            case 'GE': restrictionType = MosaicRestrictionType.GE; break;
            default: throw new Error('invalid restriction type');
        }
        return restrictionType;
    }
}
