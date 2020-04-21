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
import {Account, NetworkType, Password, SimpleWallet} from 'symbol-sdk'

import {NetworkCurrency} from '../../src/models/networkCurrency.model'
import {Profile} from '../../src/models/profile.model'

const networkCurrency = NetworkCurrency.createFromDTO({namespaceId: 'symbol.xym', divisibility: 6})


describe('Profile', () => {
    it('should contain the fields', () => {
        const profile = new Profile(
            SimpleWallet.create('default', new Password('password'), NetworkType.MIJIN_TEST),
            'url',
            'generationHash',
            networkCurrency,
            2,
        )
        expect(profile.name).to.be.equal('default')
        expect(profile.networkGenerationHash).to.be.equal('generationHash')
        expect(profile.url).to.be.equal('url')
        expect(profile.networkType).to.be.equal(NetworkType.MIJIN_TEST)
    })

    it('should be created from DTO', () => {
        const profile = Profile.createFromDTO(
            {
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
                version: 2,
                default: '1',
            })
        expect(profile.name).to.be.equal('default')
        expect(profile.networkGenerationHash).to.be.equal('generationHash')
        expect(profile.url).to.be.equal('url')
        expect(profile.networkType).to.be.equal(NetworkType.MIJIN_TEST)
    })

    it('should validate if password opens wallet', () => {
        const privateKey =  '0'.repeat(64)
        const password = new Password('password')
        const simpleWallet = SimpleWallet.createFromPrivateKey(
            'default',
            password,
            privateKey,
            NetworkType.MIJIN_TEST)
        const profile = new Profile(simpleWallet, 'url', 'generationHash', networkCurrency, 2)
        expect(profile.isPasswordValid(new Password('12345678'))).to.be.equal(false)
        expect(profile.isPasswordValid(password)).to.be.equal(true)
    })

    it('should decrypt profile', async () => {
        const privateKey =  '0'.repeat(64)
        const password = new Password('password')
        const simpleWallet = SimpleWallet.createFromPrivateKey(
            'default',
            password,
            privateKey,
            NetworkType.MIJIN_TEST)
        const profile = new Profile(simpleWallet, 'url', 'generationHash', networkCurrency, 2)
        expect(profile.decrypt(password).privateKey).to.be.equal(privateKey)
        expect(profile.address).to.be.equal(simpleWallet.address)
    })

    it('should throw error if trying to decrypt profile with an invalid password', () => {
        const privateKey =  '0'.repeat(64)
        const password = new Password('password')
        const simpleWallet = SimpleWallet.createFromPrivateKey(
            'default',
            password,
            privateKey,
            NetworkType.MIJIN_TEST)
        const profile = new Profile(simpleWallet, 'url', 'generationHash', networkCurrency, 2)
        const password2 = new Password('test12345678')
        expect(() => profile.decrypt(password2))
            .to.throws('The password provided does not match your account password')
    })
})
