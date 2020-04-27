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
import {Account, NetworkType, Password, SimpleWallet} from 'symbol-sdk'
import {expect} from 'chai'

import {NetworkCurrency} from '../../src/models/networkCurrency.model'
import {Profile} from '../../src/models/profile.model'

const networkCurrency = NetworkCurrency.createFromDTO({namespaceId: 'symbol.xym', divisibility: 6})

describe('Profile', () => {
    it('toDTO should be implemented in child classes', () => {
        class DummyProfileImplementation extends Profile {
            public static create() {
                return new DummyProfileImplementation(
                    SimpleWallet.createFromPrivateKey(
                        'default',
                        new Password('password'),
                        Account.generateNewAccount(NetworkType.TEST_NET).privateKey,
                        NetworkType.TEST_NET,
                    ),
                    'url',
                    'generation_hash',
                    networkCurrency,
                    3,
                    'PrivateKey',
                    '1',
                )
            }
        }
        expect(() => DummyProfileImplementation.create().toDTO()).to.throw()
    })
})
