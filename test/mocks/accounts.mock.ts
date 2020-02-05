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

import {Account, NetworkType} from 'nem2-sdk'

export const account1 = Account.createFromPrivateKey(
 '4EE9CE9246E8B93C4AA3931ED0D9783165C8D68713E5CB58561E7F538CE6B960',
 NetworkType.MAIN_NET,
)

export const account2 = Account.createFromPrivateKey(
 'B9B6FCC457B5D7AF81A14669BD7054AE8B4A9E9B9C22C388586CADF19C17BDA2',
 NetworkType.MAIN_NET,
)

export const account3 = Account.createFromPrivateKey(
 'F56E58A3BD5E5299B6AACF4F17746A3D9647A17D8DF7ABE27CD56D7E271CFE1C',
 NetworkType.MAIN_NET,
)
