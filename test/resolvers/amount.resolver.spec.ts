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
import {AmountResolver} from '../../src/resolvers/amount.resolver'

describe('Amount resolver', () => {

    it('should return amount', async () => {
        const amount = '10'
        const profileOptions = {amount} as any
        expect((await new AmountResolver().resolve(profileOptions)).compact())
            .to.be.equal(10)
    })

    it('should throw error if amount invalid', () => {
        const amount = '-1'
        const profileOptions = {amount} as any
        expect(() => new AmountResolver().resolve(profileOptions))
            .to.throws(Error)
    })
})
