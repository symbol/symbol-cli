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

import {account1} from '../accounts.mock'
import {namespaceId1} from '../namespaces.mock'
import {Deadline, MosaicAddressRestrictionTransaction, NetworkType, UInt64} from 'symbol-sdk'

export const unsignedMosaicAddressRestriction1 = MosaicAddressRestrictionTransaction.create(
    Deadline.create(),
    namespaceId1,
    UInt64.fromUint(1),
    account1.address,
    UInt64.fromUint(8),
    NetworkType.MIJIN_TEST,
    UInt64.fromUint(9),
)
