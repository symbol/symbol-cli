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

import {mosaic2} from '../mosaics.mock'
import {namespaceId2} from '../namespaces.mock'
import {sha3_256} from 'js-sha3'
import {Convert, Deadline, LockHashAlgorithm, NetworkType, SecretLockTransaction, UInt64} from 'symbol-sdk'

const proof = 'B778A39A3663719DFC5E48C9D78431B1E45C2AF9DF538782BF199C189DABEAC7'

export const unsignedSecretLock1 = SecretLockTransaction.create(
 Deadline.create(),
 mosaic2,
 UInt64.fromUint(100),
 LockHashAlgorithm.Op_Sha3_256,
 sha3_256.create().update(Convert.hexToUint8(proof)).hex(),
 namespaceId2,
 NetworkType.MIJIN_TEST,
)
