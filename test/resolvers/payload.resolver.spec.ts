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
import {Account, Deadline, EmptyMessage, NetworkType, TransferTransaction} from 'symbol-sdk'
import {PayloadResolver} from '../../src/resolvers/payload.resolver'

describe('Payload resolver', () => {

    it('should return transaction from payload', () => {
        let transaction: TransferTransaction
        transaction = TransferTransaction.create(
            Deadline.create(),
            Account.generateNewAccount(NetworkType.MIJIN_TEST).address,
            [],
            EmptyMessage,
            NetworkType.MIJIN_TEST)
        const payload = transaction.serialize()
        const profileOptions = {payload} as any
        expect(new PayloadResolver().resolve(profileOptions))
            .to.be.deep.equal(transaction)
    })
})
