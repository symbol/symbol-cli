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
import {expect} from 'chai';
import {PasswordResolver} from '../../src/resolvers/password.resolver';
import {PrivateKeyResolver} from '../../src/resolvers/privateKey.resolver';

describe('Private key resolver', () => {

    it('should return private key', () => {
        const privateKey = '0000000000000000000000000000000000000000000000000000000000000000';
        const profileOptions = {privateKey} as any;
        expect(new PrivateKeyResolver().resolve(profileOptions))
            .to.be.equal(privateKey);
    });

    it('should throw error if private key invalid', () => {
        const privateKey = '000';
        const profileOptions = {privateKey} as any;
        expect(() => new PrivateKeyResolver().resolve(profileOptions))
            .to.throws(Error);
    });

});
