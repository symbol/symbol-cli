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

import { expect } from 'chai';

import { BLSPublicKeyValidator } from '../../src/validators/bls.validator';

describe('BLSPublicKeyValidator validator', () => {
    it('default case ', () => {
        const upperCasePublicKey = '0'.repeat(95) + 'A';
        const lowerCasePublicKey = '0'.repeat(95) + 'a';
        expect(new BLSPublicKeyValidator().validate(upperCasePublicKey)).to.be.equal(true);
        expect(new BLSPublicKeyValidator().validate(lowerCasePublicKey)).to.be.equal(true);
    });

    it('should throw error if private key length is not 96', () => {
        const publicKey = '0'.repeat(95);
        expect(new BLSPublicKeyValidator().validate(publicKey)).to.be.equal('BLS public key should be a 96 characters hexadecimal string');
    });

    it('should throw error if private key has special chars', () => {
        const publicKey = '0'.repeat(95) + '!';
        expect(new BLSPublicKeyValidator().validate(publicKey)).to.be.equal('BLS public key should be a 96 characters hexadecimal string');
    });
});
