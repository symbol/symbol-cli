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
import {NetworkType} from 'nem2-sdk';
import {NetworkTypeResolver} from '../../src/resolvers/networkType.resolver';

describe('Network type resolver', () => {

    it('should return MAIN_NET', () => {
        const network = '0';
        const profileOptions = {network} as any;
        expect(new NetworkTypeResolver().resolve(profileOptions))
            .to.be.equal(NetworkType.MAIN_NET);
    });

    it('should return TEST_NET', () => {
        const network = '1';
        const profileOptions = {network} as any;
        expect(new NetworkTypeResolver().resolve(profileOptions))
            .to.be.equal(NetworkType.TEST_NET);
    });

    it('should return MIJIN', () => {
        const network = '2';
        const profileOptions = {network} as any;
        expect(new NetworkTypeResolver().resolve(profileOptions))
            .to.be.equal(NetworkType.MIJIN);
    });

    it('should return MIJIN_TEST', () => {
        const network = '3';
        const profileOptions = {network} as any;
        expect(new NetworkTypeResolver().resolve(profileOptions))
            .to.be.equal(NetworkType.MIJIN_TEST);
    });

    it('should throw error if network does not exist', () => {
        const network = '4';
        const profileOptions = {network} as any;
        expect(() => new NetworkTypeResolver().resolve(profileOptions))
            .to.throws(Error);
    });

});
