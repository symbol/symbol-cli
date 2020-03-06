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

import {mosaic1, mosaic2} from '../mosaics.mock'
import {namespaceId2} from '../namespaces.mock'
import {Address, Deadline, NetworkType, PlainMessage, TransferTransaction, UInt64} from 'symbol-sdk'

export const unsignedTransfer1 = new TransferTransaction(
 NetworkType.MAIN_NET,
 1,
 Deadline.create(),
 UInt64.fromUint(1000),
 Address.createFromRawAddress('TALRJL-Z2FDOI-B7JCZJ-ANUJCM-GCJA6R-BRIYK4-NTDM'),
 [mosaic1],
 PlainMessage.create('This is a mock message!'),
)

export const unsignedTransfer2 = new TransferTransaction(
 NetworkType.MAIN_NET,
 1,
 Deadline.create(),
 UInt64.fromUint(1000),
 namespaceId2,
 [mosaic1, mosaic2],
 PlainMessage.create('This is a mock message!'),
)
