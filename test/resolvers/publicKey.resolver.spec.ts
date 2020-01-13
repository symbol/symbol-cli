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
import {CosignatoryPublicKeyResolver, MultisigAccountPublicKeyResolver, PublicKeyResolver} from '../../src/resolvers/publicKey.resolver';

describe('Public key resolver', () => {

    it('should return public key', () => {
        const publicKey = '0000000000000000000000000000000000000000000000000000000000000000';
        const profileOptions = {publicKey} as any;
        expect(new PublicKeyResolver().resolve(profileOptions).publicKey)
            .to.be.equal(publicKey);
    });

    it('should throw error if public key invalid', () => {
        const publicKey = '000';
        const profileOptions = {publicKey} as any;
        expect(() => new PublicKeyResolver().resolve(profileOptions))
            .to.throws(Error);
    });

});

describe('Multisig account public key resolver', () => {

    it('should return public key', () => {
        const multisigAccountPublicKey = '0000000000000000000000000000000000000000000000000000000000000000';
        const profileOptions = {multisigAccountPublicKey} as any;
        expect(new MultisigAccountPublicKeyResolver().resolve(profileOptions).publicKey)
            .to.be.equal(multisigAccountPublicKey);
    });

    it('should throw error if public key invalid', () => {
        const multisigAccountPublicKey = '000';
        const profileOptions = {multisigAccountPublicKey} as any;
        expect(() => new MultisigAccountPublicKeyResolver().resolve(profileOptions))
            .to.throws(Error);
    });

});

describe('Cosignatory public key resolver', () => {

    it('should return public key', () => {
        const cosignatoryPublicKey = '0000000000000000000000000000000000000000000000000000000000000000,' +
            '0000000000000000000000000000000000000000000000000000000000000001';
        const profileOptions = {cosignatoryPublicKey} as any;
        const resolution = new CosignatoryPublicKeyResolver().resolve(profileOptions);
        expect(resolution[0].publicKey)
            .to.be.equal('0000000000000000000000000000000000000000000000000000000000000000');
        expect(resolution[1].publicKey)
            .to.be.equal('0000000000000000000000000000000000000000000000000000000000000001');
    });

    it('should throw error if public key invalid', () => {
        const cosignatoryPublicKey = '000,000';
        const profileOptions = {cosignatoryPublicKey} as any;
        expect(() => new CosignatoryPublicKeyResolver().resolve(profileOptions))
            .to.throws(Error);
    });

});

describe('Target public key resolver', () => {

    it('should return public key', () => {
        const publicKey = '0000000000000000000000000000000000000000000000000000000000000000';
        const profileOptions = {publicKey} as any;
        expect(new PublicKeyResolver().resolve(profileOptions).publicKey)
            .to.be.equal(publicKey);
    });

    it('should throw error if public key invalid', () => {
        const publicKey = '000';
        const profileOptions = {publicKey} as any;
        expect(() => new PublicKeyResolver().resolve(profileOptions))
            .to.throws(Error);
    });

});
