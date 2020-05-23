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

import { Account, NetworkType, Password } from 'symbol-sdk';

import { HdProfile } from '../../../src/models/hdProfile.model';
import { NetworkCurrency } from '../../../src/models/networkCurrency.model';
import { PrivateKeyProfile } from '../../../src/models/privateKeyProfile.model';

const networkCurrency = NetworkCurrency.createFromDTO({ namespaceId: 'symbol.xym', divisibility: 6 });

export const mockPrivateKeyProfile1 = PrivateKeyProfile.create({
    generationHash: 'test',
    isDefault: false,
    name: 'default',
    networkCurrency,
    networkType: NetworkType.MIJIN_TEST,
    password: new Password('password'),
    url: 'http://localhost:1234',
    privateKey: Account.generateNewAccount(NetworkType.MIJIN_TEST).privateKey,
});

export const mockHdProfile1 = HdProfile.create({
    generationHash: 'test',
    isDefault: false,
    name: 'default',
    networkCurrency,
    networkType: NetworkType.MIJIN_TEST,
    password: new Password('password'),
    url: 'http://localhost:1234',
    // eslint-disable-next-line max-len
    mnemonic:
        'uniform promote eyebrow frequent mother order evolve spell elite lady clarify accuse annual tenant rotate walnut wisdom render before million scrub scan crush sense',
    pathNumber: 0,
});
