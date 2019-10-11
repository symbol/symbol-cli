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
import {expect} from 'chai';
import {AccountRestrictionType} from 'nem2-sdk';
import {RestrictionService} from '../../src/service/restriction.service';

describe('Restriction service', () => {

    it('getAccountAddressRestrictionType should return valid type', () => {
        const service = new RestrictionService();
        expect(service.getAccountAddressRestrictionType('allow', 'incoming'))
            .to.be.equal(AccountRestrictionType.AllowIncomingAddress);
        expect(service.getAccountAddressRestrictionType('block', 'incoming'))
            .to.be.equal(AccountRestrictionType.BlockIncomingAddress);
        expect(service.getAccountAddressRestrictionType('allow', 'outgoing'))
            .to.be.equal(AccountRestrictionType.AllowOutgoingAddress);
        expect(service.getAccountAddressRestrictionType('block', 'outgoing'))
            .to.be.equal(AccountRestrictionType.BlockOutgoingAddress);

    });

    it('getAccountAddressRestrictionType should return valid type with typo', () => {
        const service = new RestrictionService();
        expect(service.getAccountAddressRestrictionType('aLlow', 'incOming'))
            .to.be.equal(AccountRestrictionType.AllowIncomingAddress);
        expect(service.getAccountAddressRestrictionType('Block', 'iNcoming'))
            .to.be.equal(AccountRestrictionType.BlockIncomingAddress);
        expect(service.getAccountAddressRestrictionType('aLlow', 'outgoIng'))
            .to.be.equal(AccountRestrictionType.AllowOutgoingAddress);
        expect(service.getAccountAddressRestrictionType('blOck', 'ouTgoing'))
            .to.be.equal(AccountRestrictionType.BlockOutgoingAddress);

    });

    it('getMosaicRestrictionType should return valid type', () => {
        const service = new RestrictionService();
        expect(service.getAccountMosaicRestrictionType('allow'))
            .to.be.equal(AccountRestrictionType.AllowMosaic);
        expect(service.getAccountMosaicRestrictionType('block'))
            .to.be.equal(AccountRestrictionType.BlockMosaic);
    });

    it('getAccountAddressRestrictionType should return valid type with typo', () => {
        const service = new RestrictionService();
        expect(service.getAccountMosaicRestrictionType('Allow'))
            .to.be.equal(AccountRestrictionType.AllowMosaic);
        expect(service.getAccountMosaicRestrictionType('blocK'))
            .to.be.equal(AccountRestrictionType.BlockMosaic);

    });
    it('getAccountOperationRestrictionType should return valid type', () => {
        const service = new RestrictionService();
        expect(service.getAccountOperationRestrictionType('allow', 'incoming'))
            .to.be.equal(AccountRestrictionType.AllowIncomingTransactionType);
        expect(service.getAccountOperationRestrictionType('block', 'incoming'))
            .to.be.equal(AccountRestrictionType.BlockIncomingTransactionType);
        expect(service.getAccountOperationRestrictionType('allow', 'outgoing'))
            .to.be.equal(AccountRestrictionType.AllowOutgoingTransactionType);
        expect(service.getAccountOperationRestrictionType('block', 'outgoing'))
            .to.be.equal(AccountRestrictionType.BlockOutgoingTransactionType);

    });

    it('getAccountAddressRestrictionType should return valid type with typo', () => {
        const service = new RestrictionService();
        expect(service.getAccountOperationRestrictionType('aLlow', 'incomIng'))
            .to.be.equal(AccountRestrictionType.AllowIncomingTransactionType);
        expect(service.getAccountOperationRestrictionType('bLock', 'inComing'))
            .to.be.equal(AccountRestrictionType.BlockIncomingTransactionType);
        expect(service.getAccountOperationRestrictionType('Allow', 'ouTgoing'))
            .to.be.equal(AccountRestrictionType.AllowOutgoingTransactionType);
        expect(service.getAccountOperationRestrictionType('bLock', 'oUtgoing'))
            .to.be.equal(AccountRestrictionType.BlockOutgoingTransactionType);
    });

});
