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
import {PasswordResolver} from '../../src/resolvers/password.resolver'
import {expect} from 'chai'

describe('Password resolver', () => {

    it('should return password', async () => {
        const password = '12345678'
        const options = {password} as any
        expect((await new PasswordResolver().resolve(options)).value)
            .to.be.equal(password)
    })

    it('should change key', async () => {
        const key = '12345678'
        const options = {key} as any
        expect((await new PasswordResolver()
            .resolve(options, 'altText', 'key')).value)
            .to.be.equal(key)
    })


})
