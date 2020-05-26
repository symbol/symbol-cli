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
import { Account, NetworkType, Password } from 'symbol-sdk';

import { NetworkCurrency } from '../../src/models/networkCurrency.model';
import { PrivateKeyProfile } from '../../src/models/privateKeyProfile.model';
import { mockPrivateKeyProfile1 } from '../mocks/profiles/profile.mock';

const networkCurrency = NetworkCurrency.createFromDTO({ namespaceId: 'symbol.xym', divisibility: 6 });

describe('PrivateKeyProfile', () => {
    it('should contain the fields', () => {
        const profile = PrivateKeyProfile.create({
            generationHash: 'generationHash',
            isDefault: false,
            name: 'default',
            networkCurrency,
            networkType: NetworkType.MIJIN_TEST,
            password: new Password('password'),
            url: 'http://localhost:1234',
            privateKey: Account.generateNewAccount(NetworkType.MIJIN_TEST).privateKey,
        });

        expect(profile.name).to.be.equal('default');
        expect(profile.networkGenerationHash).to.be.equal('generationHash');
        expect(profile.url).to.be.equal('http://localhost:1234');
        expect(profile.networkType).to.be.equal(NetworkType.MIJIN_TEST);
        expect(profile.type).to.be.equal('PrivateKey');
        expect(profile).to.be.instanceOf(PrivateKeyProfile);
    });

    it('should be created from DTO', () => {
        const profile = PrivateKeyProfile.createFromDTO({
            simpleWallet: {
                name: 'default',
                network: NetworkType.MIJIN_TEST,
                address: {
                    address: Account.generateNewAccount(NetworkType.MIJIN_TEST).address.plain(),
                    networkType: NetworkType.MIJIN_TEST,
                },
                creationDate: 'test',
                schema: 'test',
                encryptedPrivateKey: 'test',
            },
            networkGenerationHash: 'generationHash',
            url: 'url',
            networkCurrency: {
                namespaceId: 'symbol.xym',
                divisibility: 6,
            },
            version: 3,
            default: '1',
            type: 'PrivateKey',
        });
        expect(profile.name).to.be.equal('default');
        expect(profile.networkGenerationHash).to.be.equal('generationHash');
        expect(profile.url).to.be.equal('url');
        expect(profile.networkType).to.be.equal(NetworkType.MIJIN_TEST);
        expect(profile).to.be.instanceOf(PrivateKeyProfile);
    });

    it('should validate if password opens wallet', () => {
        const password = new Password('password');
        const networkType = NetworkType.MIJIN_TEST;
        const profile = PrivateKeyProfile.create({
            generationHash: 'default',
            isDefault: false,
            name: 'default',
            networkCurrency,
            networkType,
            password,
            url: 'http://localhost:3000',
            privateKey: Account.generateNewAccount(networkType).privateKey,
        });

        expect(profile.isPasswordValid(new Password('12345678'))).to.be.equal(false);
        expect(profile.isPasswordValid(password)).to.be.equal(true);
        expect(profile).to.be.instanceOf(PrivateKeyProfile);
    });

    it('should decrypt profile', async () => {
        const password = new Password('password');
        const networkType = NetworkType.MIJIN_TEST;
        const account = Account.generateNewAccount(networkType);

        const profile = PrivateKeyProfile.create({
            generationHash: 'default',
            isDefault: false,
            name: 'default',
            networkCurrency,
            networkType,
            password,
            url: 'http://localhost:3000',
            privateKey: account.privateKey,
        });

        expect(profile.decrypt(password).privateKey).to.equal(account.privateKey);
        expect(profile.address).to.deep.equal(account.address);
        expect(profile).to.be.instanceOf(PrivateKeyProfile);
    });

    it('should throw error if trying to decrypt profile with an invalid password', () => {
        const networkType = NetworkType.MIJIN_TEST;
        const profile = PrivateKeyProfile.create({
            generationHash: 'default',
            isDefault: false,
            name: 'default',
            networkCurrency,
            networkType,
            password: new Password('password'),
            url: 'http://localhost:3000',
            privateKey: Account.generateNewAccount(networkType).privateKey,
        });

        const wrongPassword = new Password('test12345678');
        expect(() => profile.decrypt(wrongPassword)).to.throws('The password provided does not match your account password');
    });

    it('toString should return a non-numnl string', () => {
        expect(mockPrivateKeyProfile1.toString().length).to.be.greaterThan(0);
    });
});
