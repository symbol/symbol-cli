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
import {PasswordResolver} from '../../src/resolvers/password.resolver'

describe('Password resolver', () => {

    it('should return password', () => {
        const password = '12345678'
        const profileOptions = {password} as any
        expect(new PasswordResolver().resolve(profileOptions).value)
            .to.be.equal(password)
    })

    it('should throw error if password invalid', () => {
        const password = '12345'
        const profileOptions = {password} as any
        expect(() => new PasswordResolver().resolve(profileOptions))
            .to.throws(Error)
    })

})
