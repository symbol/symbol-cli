/*
 *
 * Copyright 2018 NEM
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

import {expect} from 'chai';
import {Account, NetworkType} from 'nem2-sdk';
import {Profile} from '../../src/model/profile';

describe('Profile', () => {
    it('should contain the fields', () => {
        const profile = new Profile(
            Account.createFromPrivateKey('706B22AF6E95541A2AEE209DD635FABB06AD2D6D4FB6ECFB59AD1AA4E9C2F1DB', NetworkType.MIJIN_TEST),
            NetworkType.MIJIN_TEST,
            'url',
            'default',
        );
        expect(profile['name']).to.be.equal('default');
    });
});
