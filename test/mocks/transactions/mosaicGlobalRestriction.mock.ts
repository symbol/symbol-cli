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

import {mosaicId1, mosaicId2} from '../mosaics.mock'
import {Deadline, MosaicGlobalRestrictionTransaction, MosaicRestrictionType, NetworkType, UInt64} from 'symbol-sdk'

export const unsignedMosaicGlobalRestriction1 = MosaicGlobalRestrictionTransaction
    .create(
        Deadline.create(),
        mosaicId1,
        UInt64.fromUint(1),
        UInt64.fromUint(9),
        MosaicRestrictionType.EQ,
        UInt64.fromUint(8),
        MosaicRestrictionType.GE,
        NetworkType.MIJIN_TEST,
        mosaicId2,
    )
