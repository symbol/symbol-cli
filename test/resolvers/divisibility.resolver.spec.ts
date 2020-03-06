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
import {DivisibilityResolver} from '../../src/resolvers/divisibility.resolver'
import {expect} from 'chai'

describe('Divisibility resolver', () => {

    it('should return divisibility', async () => {
        const divisibility = '6'
        const options = {divisibility} as any
        expect(await new DivisibilityResolver().resolve(options))
            .to.be.equal(6)
    })

    it('should change key', async () => {
        const key = '6'
        const options = {key} as any
        expect(await new DivisibilityResolver()
            .resolve(options, 'altText', 'key'))
            .to.be.equal(6)
    })


})
