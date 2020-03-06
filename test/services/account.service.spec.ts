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
import {AccountService} from '../../src/services/account.service'
import {expect} from 'chai'
import {Address, NamespaceId} from 'symbol-sdk'

describe('Account service', () => {

    it('should create account service', () => {
        expect(new AccountService()).to.not.be.equal(undefined)
    })

    it('should return an alias', () => {
        const rawRecipient = '@foo'
        expect(AccountService.getRecipient(rawRecipient)).to.be.instanceOf(NamespaceId)
    })

    it('should return an address', () => {
        const rawRecipient = 'SDSMQK-MKCAE3-LHGKTD-NE7NYJ-OYEFDK-LAWAKW-KRAM'
        expect(AccountService.getRecipient(rawRecipient)).to.be.instanceOf(Address)
    })

})
