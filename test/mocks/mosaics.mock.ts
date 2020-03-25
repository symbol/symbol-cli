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

import {namespaceId1} from './namespaces.mock'
import {Mosaic, MosaicId, UInt64} from 'symbol-sdk'

export const mosaicId1 = new MosaicId([3646934825, 3576016193])
export const mosaicId2 = new MosaicId([2262289484, 3405110546])
export const mosaicId3 = new MosaicId('504677C3281108DB')

export const mosaic1 = new Mosaic(mosaicId1, new UInt64([1, 0]))
export const mosaic2 = new Mosaic(namespaceId1, UInt64.fromUint(1234567890))
