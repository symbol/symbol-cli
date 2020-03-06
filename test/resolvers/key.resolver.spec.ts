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
import {KeyResolver} from '../../src/resolvers/key.resolver'
import {expect} from 'chai'
import {KeyGenerator} from 'symbol-sdk'

describe('Key resolver', () => {

    it('should return key', async () => {
        const key = KeyGenerator.generateUInt64Key('test').toHex()
        const options = {key} as any
        expect((await new KeyResolver().resolve(options)).toHex())
            .to.be.equal(key)
    })

    it('should change key', async () => {
        const k1 = KeyGenerator.generateUInt64Key('test').toHex()
        const options = {k1} as any
        expect((await new KeyResolver()
            .resolve(options, 'altText', 'k1')).toHex())
            .to.be.equal(k1)
    })

})
