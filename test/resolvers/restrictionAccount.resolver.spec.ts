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
import {expect} from 'chai'
import {AccountRestrictionFlags} from 'nem2-sdk'
import {
    RestrictionAccountAddressFlagsResolver,
    RestrictionAccountMosaicFlagsResolver,
    RestrictionAccountOperationFlagsResolver,
} from '../../src/resolvers/restrictionAccount.resolver'

describe('Restriction account address flags resolver', () => {

    it('should return AllowOutgoingAddress', () => {
        const flags = AccountRestrictionFlags.AllowOutgoingAddress
        const profileOptions = {flags} as any
        expect(new RestrictionAccountAddressFlagsResolver().resolve(profileOptions))
            .to.be.equal(AccountRestrictionFlags.AllowOutgoingAddress)
    })

    it('should return BlockOutgoingAddress', () => {
        const flags = AccountRestrictionFlags.BlockOutgoingAddress
        const profileOptions = {flags} as any
        expect(new RestrictionAccountAddressFlagsResolver().resolve(profileOptions))
            .to.be.equal(AccountRestrictionFlags.BlockOutgoingAddress)
    })

    it('should return AllowIncomingAddress', () => {
        const flags = AccountRestrictionFlags.AllowIncomingAddress
        const profileOptions = {flags} as any
        expect(new RestrictionAccountAddressFlagsResolver().resolve(profileOptions))
            .to.be.equal(AccountRestrictionFlags.AllowIncomingAddress)
    })

    it('should return BlockIncomingAddress', () => {
        const flags = AccountRestrictionFlags.BlockIncomingAddress
        const profileOptions = {flags} as any
        expect(new RestrictionAccountAddressFlagsResolver().resolve(profileOptions))
            .to.be.equal(AccountRestrictionFlags.BlockIncomingAddress)
    })

    it('should throw error if flag does not exist', () => {
        const flags = '@'
        const profileOptions = {flags} as any
        expect(() => new RestrictionAccountAddressFlagsResolver().resolve(profileOptions))
            .to.throws(Error)
    })

})

describe('Restriction account mosaic flags resolver', () => {

    it('should return AllowMosaic', async () => {
        const flags = AccountRestrictionFlags.AllowMosaic
        const profileOptions = {flags} as any
        expect(await new RestrictionAccountMosaicFlagsResolver().resolve(profileOptions))
            .to.be.equal(AccountRestrictionFlags.AllowMosaic)
    })

    it('should return BlockMosaic', async () => {
        const flags = AccountRestrictionFlags.BlockMosaic
        const profileOptions = {flags} as any
        expect(await new RestrictionAccountMosaicFlagsResolver().resolve(profileOptions))
            .to.be.equal(AccountRestrictionFlags.BlockMosaic)
    })

    it('should throw error if flag not exist', () => {
        const flags = '@'
        const profileOptions = {flags} as any
        expect(async () => await new RestrictionAccountMosaicFlagsResolver().resolve(profileOptions))
            .to.throws(Error)
    })

})

describe('Restriction account operation flags resolver', () => {

    it('should return AllowOutgoingTransactionType', () => {
        const flags = AccountRestrictionFlags.AllowOutgoingTransactionType
        const profileOptions = {flags} as any
        expect(new RestrictionAccountOperationFlagsResolver().resolve(profileOptions))
            .to.be.equal(AccountRestrictionFlags.AllowOutgoingTransactionType)
    })

    it('should return BlockOutgoingTransactionType', () => {
        const flags = AccountRestrictionFlags.BlockOutgoingTransactionType
        const profileOptions = {flags} as any
        expect(new RestrictionAccountOperationFlagsResolver().resolve(profileOptions))
            .to.be.equal(AccountRestrictionFlags.BlockOutgoingTransactionType)
    })

    it('should throw error if flag not exist', () => {
        const flags = '@'
        const profileOptions = {flags} as any
        expect(() => new RestrictionAccountOperationFlagsResolver().resolve(profileOptions))
            .to.throws(Error)
    })

})
