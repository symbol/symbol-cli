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
import {Address, MosaicId, NamespaceId} from 'nem2-sdk';
import {AliasService} from '../../src/service/alias.service';

describe('Alias service', () => {

    it('getMosaicId should return an alias', () => {
        const rawMosaicId = '@foo';
        expect(AliasService.getMosaicId(rawMosaicId)).to.be.instanceOf(NamespaceId);
    });

    it('getMosaicId (hex) should return a MosaicId', () => {
        const rawMosaicId = '175785202c44e5db';
        expect(AliasService.getMosaicId(rawMosaicId)).to.be.instanceOf(MosaicId);
    });

    it('getRecipient should return an alias', () => {
        const rawRecipient = '@foo';
        expect(AliasService.getRecipient(rawRecipient)).to.be.instanceOf(NamespaceId);
    });

    it('getRecipient should return an address', () => {
        const rawRecipient = 'SDSMQK-MKCAE3-LHGKTD-NE7NYJ-OYEFDK-LAWAKW-KRAM';
        expect(AliasService.getRecipient(rawRecipient)).to.be.instanceOf(Address);
    });
});
