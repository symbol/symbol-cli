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
import {AccountRestrictionFlags} from 'nem2-sdk';
import {RestrictionService} from '../../src/service/restriction.service';

describe('Restriction service', () => {

    it('getAccountAddressRestrictionFlags should return valid type', () => {
        const service = new RestrictionService();
        expect(service.getAccountAddressRestrictionFlags('allow', 'incoming'))
            .to.be.equal(AccountRestrictionFlags.AllowIncomingAddress);
        expect(service.getAccountAddressRestrictionFlags('block', 'incoming'))
            .to.be.equal(AccountRestrictionFlags.BlockIncomingAddress);
        expect(service.getAccountAddressRestrictionFlags('allow', 'outgoing'))
            .to.be.equal(AccountRestrictionFlags.AllowOutgoingAddress);
        expect(service.getAccountAddressRestrictionFlags('block', 'outgoing'))
            .to.be.equal(AccountRestrictionFlags.BlockOutgoingAddress);

    });

    it('getAccountAddressRestrictionFlags should return valid type with typo', () => {
        const service = new RestrictionService();
        expect(service.getAccountAddressRestrictionFlags('aLlow', 'incOming'))
            .to.be.equal(AccountRestrictionFlags.AllowIncomingAddress);
        expect(service.getAccountAddressRestrictionFlags('Block', 'iNcoming'))
            .to.be.equal(AccountRestrictionFlags.BlockIncomingAddress);
        expect(service.getAccountAddressRestrictionFlags('aLlow', 'outgoIng'))
            .to.be.equal(AccountRestrictionFlags.AllowOutgoingAddress);
        expect(service.getAccountAddressRestrictionFlags('blOck', 'ouTgoing'))
            .to.be.equal(AccountRestrictionFlags.BlockOutgoingAddress);

    });

    it('getMosaicRestrictionFlags should return valid type', () => {
        const service = new RestrictionService();
        expect(service.getAccountMosaicRestrictionFlags('allow'))
            .to.be.equal(AccountRestrictionFlags.AllowMosaic);
        expect(service.getAccountMosaicRestrictionFlags('block'))
            .to.be.equal(AccountRestrictionFlags.BlockMosaic);
    });

    it('getAccountAddressRestrictionFlags should return valid type with typo', () => {
        const service = new RestrictionService();
        expect(service.getAccountMosaicRestrictionFlags('Allow'))
            .to.be.equal(AccountRestrictionFlags.AllowMosaic);
        expect(service.getAccountMosaicRestrictionFlags('blocK'))
            .to.be.equal(AccountRestrictionFlags.BlockMosaic);

    });
    it('getAccountOperationRestrictionFlags should return valid type', () => {
        const service = new RestrictionService();
        expect(service.getAccountOperationRestrictionFlags('allow'))
            .to.be.equal(AccountRestrictionFlags.AllowOutgoingTransactionType);
        expect(service.getAccountOperationRestrictionFlags('block'))
            .to.be.equal(AccountRestrictionFlags.BlockOutgoingTransactionType);

    });

    it('getAccountAddressRestrictionFlags should return valid type with typo', () => {
        const service = new RestrictionService();
        expect(service.getAccountOperationRestrictionFlags('Allow'))
            .to.be.equal(AccountRestrictionFlags.AllowOutgoingTransactionType);
        expect(service.getAccountOperationRestrictionFlags('bLock'))
            .to.be.equal(AccountRestrictionFlags.BlockOutgoingTransactionType);
    });

});
