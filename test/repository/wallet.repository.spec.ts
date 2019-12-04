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
import * as fs from 'fs';
import { Account, NetworkType, Password, SimpleWallet } from 'nem2-sdk';
import { Wallet } from '../../src/model/wallet';
import { WalletRepository } from '../../src/respository/wallet.repository';

describe('WalletRepository', () => {

    let repositoryFileUrl: string;

    const removeAccountsFile = () => {
        if (fs.existsSync(process.env.HOME + '/' + repositoryFileUrl)) {
            fs.unlinkSync(process.env.HOME + '/' + repositoryFileUrl);
        }
    };

    before(() => {
        removeAccountsFile();
        repositoryFileUrl = '.nem2rctest.json';
    });

    after(() => {
        removeAccountsFile();
    });

    it('should create account repository via constructor', () => {
        const walletRepository = new WalletRepository(repositoryFileUrl);
        expect(walletRepository).to.not.be.equal(undefined);
    });

    it('should save new account', () => {
        const walletName = 'test';
        const walletPassword = '123123123';
        const networkType = NetworkType.MIJIN_TEST;
        const simpleWallet = SimpleWallet.create(walletName, new Password(walletPassword), networkType);
        const url = 'http://localhost:3000';
        const networkGenerationHash = 'test';
        const walletRepository = new WalletRepository(repositoryFileUrl);
        const savedWallet = walletRepository.save(simpleWallet, url, networkGenerationHash);
        expect(savedWallet.name).to.be.equal(walletName);
    });

    it('should save new account and find it', () => {
        // const account = Account.createFromPrivateKey('CEDF9CB6F5D4EF67CA2F2FD4CA993F80E4FC615DFD230E15842B0A6475730B30',
        //     NetworkType.MIJIN_TEST);
        const walletName = 'test';
        const walletPassword = '123123123';
        const networkType = NetworkType.MIJIN_TEST;
        const simpleWallet = SimpleWallet.create(walletName, new Password(walletPassword), networkType);
        const url = 'http://localhost:3000';
        const walletRepository = new WalletRepository(repositoryFileUrl);
        const networkGenerationHash = 'test';
        walletRepository.save(simpleWallet, url, networkGenerationHash);
        const savedWallet = walletRepository.find(walletName);
        expect(savedWallet).to.not.be.equal(undefined);
        if (savedWallet instanceof Wallet) {
            expect(savedWallet.name).to.be.equal(walletName);
            expect(savedWallet.url).to.be.equal(url);
            expect(savedWallet.networkType).to.be.equal(NetworkType.MIJIN_TEST);
            expect(savedWallet.networkGenerationHash).to.be.equal('test');
        }
    });

    it('should not find not saved account', () => {
        const walletRepository = new WalletRepository(repositoryFileUrl);
        expect(() => walletRepository.find('no_name')).to.throw(Error);
    });

    it('should save two account with name default and find last one', () => {
        const walletName1 = 'test1';
        const walletPassword1 = '123123123';
        const networkType1 = NetworkType.MIJIN_TEST;
        const url1 = 'http://localhost:3000';
        const networkGenerationHash1 = 'test1';
        const simpleWallet1 = SimpleWallet.create(walletName1, new Password(walletPassword1), networkType1);

        const walletName2 = 'test2';
        const walletPassword2 = '123123123123';
        const networkType2 = NetworkType.MIJIN_TEST;
        const url2 = 'http://localhost:3000';
        const networkGenerationHash2 = 'test2';
        const simpleWallet2 = SimpleWallet.create(walletName2, new Password(walletPassword2), networkType2);

        const walletRepository = new WalletRepository(repositoryFileUrl);
        walletRepository.save(simpleWallet1, url1, networkGenerationHash1);
        walletRepository.setDefaultWallet(simpleWallet1.name);
        walletRepository.save(simpleWallet2, url2, networkGenerationHash2);
        walletRepository.setDefaultWallet(simpleWallet2.name);

        const savedWallet = walletRepository.getDefaultWallet();
        console.log(savedWallet);
        expect(savedWallet).to.not.be.equal(undefined);
        if (savedWallet instanceof Wallet) {
            expect(savedWallet.name).to.be.equal(walletName2);
            expect(savedWallet.url).to.be.equal(url2);
            expect(savedWallet.networkType).to.be.equal(networkType2);
            expect(savedWallet.networkGenerationHash).to.be.equal(networkGenerationHash2);
        }
    });

    it('should save two accounts and find one', () => {
        const walletName1 = 'test1';
        const walletPassword1 = '123123123';
        const networkType1 = NetworkType.MIJIN_TEST;
        const url1 = 'http://localhost:3000';
        const networkGenerationHash1 = 'test1';
        const simpleWallet1 = SimpleWallet.create(walletName1, new Password(walletPassword1), networkType1);

        const walletName2 = 'test2';
        const walletPassword2 = '123123123123';
        const networkType2 = NetworkType.MIJIN_TEST;
        const url2 = 'http://localhost:3000';
        const networkGenerationHash2 = 'test2';
        const simpleWallet2 = SimpleWallet.create(walletName2, new Password(walletPassword2), networkType2);

        const walletRepository = new WalletRepository(repositoryFileUrl);
        walletRepository.save(simpleWallet1, url1, networkGenerationHash1);
        walletRepository.save(simpleWallet2, url2, networkGenerationHash2);
        walletRepository.setDefaultWallet(walletName2);

        const savedWallet = walletRepository.find(walletName1);
        expect(savedWallet).to.not.be.equal(undefined);
        if (savedWallet instanceof Wallet) {
            expect(savedWallet.name).to.be.equal(walletName1);
            expect(savedWallet.url).to.be.equal(url1);
            expect(savedWallet.networkType).to.be.equal(networkType1);
            expect(savedWallet.networkGenerationHash).to.be.equal(networkGenerationHash1);
        }
    });

});
