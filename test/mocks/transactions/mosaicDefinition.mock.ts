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

import {mosaicId1} from '../mosaics.mock'
import {Deadline, MosaicDefinitionTransaction, MosaicFlags, MosaicNonce, NetworkType, UInt64} from 'symbol-sdk'

export const unsignedMosaicDefinition1 = MosaicDefinitionTransaction.create(
 Deadline.create(),
 new MosaicNonce(new Uint8Array([0xE6, 0xDE, 0x84, 0xB8])), // nonce
 mosaicId1, // ID
 MosaicFlags.create(true, true, true),
 3,
 UInt64.fromUint(1000),
 NetworkType.MIJIN_TEST,
)
