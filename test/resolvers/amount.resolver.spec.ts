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
import {AmountResolver} from '../../src/resolvers/amount.resolver'
import {expect} from 'chai'

describe('Amount resolver', () => {

    it('should return amount', async () => {
        const amount = '10'
        const options = {amount} as any
        expect((await new AmountResolver().resolve(options)).compact())
            .to.be.equal(10)
    })

    it('should change key', async () => {
        const key = '10'
        const options = {key} as any
        expect((await new AmountResolver()
            .resolve(options, 'altText', 'key')).compact())
            .to.be.equal(10)
    })

})
