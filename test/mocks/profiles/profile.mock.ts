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

import {NetworkType, Password, SimpleWallet} from 'symbol-sdk'

import {NetworkCurrency} from '../../../src/models/networkCurrency.model'
import {Profile} from '../../../src/models/profile.model'

const simpleWallet1 = SimpleWallet.create('test', new Password('password'), NetworkType.MIJIN_TEST)
const url1 = 'http://localhost:1234'
const networkGenerationHash1 = 'test'
const networkCurrency = NetworkCurrency.createFromDTO({namespaceId: 'symbol.xym', divisibility: 6})

export const mockProfile1 = new Profile(simpleWallet1, url1, networkGenerationHash1, networkCurrency, 2)
