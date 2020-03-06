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
import {NetworkResolver} from '../../src/resolvers/network.resolver'
import {expect} from 'chai'
import {NetworkType} from 'symbol-sdk'

describe('Network type resolver', () => {

    it('should return MAIN_NET', async () => {
        const network = 'MAIN_NET'
        const options = {network} as any
        expect(await new NetworkResolver().resolve(options))
            .to.be.equal(NetworkType.MAIN_NET)
    })

    it('should return TEST_NET', async () => {
        const network = 'TEST_NET'
        const options = {network} as any
        expect(await new NetworkResolver().resolve(options))
            .to.be.equal(NetworkType.TEST_NET)
    })

    it('should return MIJIN', async () => {
        const network = 'MIJIN'
        const options = {network} as any
        expect(await new NetworkResolver().resolve(options))
            .to.be.equal(NetworkType.MIJIN)
    })

    it('should return MIJIN_TEST', async () => {
        const network = 'MIJIN_TEST'
        const options = {network} as any
        expect(await new NetworkResolver().resolve(options))
            .to.be.equal(NetworkType.MIJIN_TEST)
    })

    it('should change key', async () => {
        const key = 'MIJIN_TEST'
        const options = {key} as any
        expect(await new NetworkResolver()
            .resolve(options, 'altText', 'key'))
            .to.be.equal(NetworkType.MIJIN_TEST)
    })


})
