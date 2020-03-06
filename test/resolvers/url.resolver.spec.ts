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
import {URLResolver} from '../../src/resolvers/url.resolver'
import {expect} from 'chai'

describe('Url resolver', () => {

    it('should return url', async () => {
        const url = 'https://localhost:3000'
        const options = {url} as any
        expect(await new URLResolver().resolve(options))
            .to.be.equal(url)
    })

    it('should return url without trailing backslash', async () => {
        const url = 'https://localhost:3000/'
        const options = {url} as any
        expect(await new URLResolver().resolve(options))
            .to.be.equal('https://localhost:3000')
    })

    it('should change key', async () => {
        const key = 'https://localhost:3000/'
        const options = {key} as any
        expect(await new URLResolver()
            .resolve(options, undefined, 'altText', 'key'))
            .to.be.equal('https://localhost:3000')
    })

})
