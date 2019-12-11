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
import { Account, NetworkType, Password, SimpleWallet } from 'nem2-sdk';
import { instance, mock, when } from 'ts-mockito';
import { Wallet } from '../../src/model/wallet';
import { WalletRepository } from '../../src/respository/wallet.repository';
import { WalletService } from '../../src/service/wallet.service';

describe('Configure service', () => {
    it('should create configure service instance via constructor', () => {
        const mockWalletRepository = mock(WalletRepository);
        const walletService = new WalletService(instance(mockWalletRepository));
        expect(walletService).to.not.be.equal(undefined);
    });

    it('should create a new wallet', () => {
        const walletName = 'testWallet';
        const walletPassword = '123123123';
        const networkType = NetworkType.MIJIN_TEST;
        const simpleWallet = SimpleWallet.create(walletName, new Password(walletPassword), networkType);
        const url = 'http://localhost:1234';
        const networkGenerationHash = 'test';
        const wallet = new Wallet(
            walletName,
            networkType,
            url,
            networkGenerationHash,
            simpleWallet.address,
            simpleWallet.encryptedPrivateKey);

        const mockWalletRepository = mock(WalletRepository);
        when(mockWalletRepository.save(simpleWallet, url, networkGenerationHash))
            .thenReturn(wallet);

        const walletService = new WalletService(instance(mockWalletRepository));
        const createdWallet = walletService.createWallet(simpleWallet, url, networkGenerationHash);
        expect(createdWallet.name).to.be.equal(walletName);
        expect(createdWallet.url).to.be.equal(url);
        expect(createdWallet.networkType).to.be.equal(NetworkType.MIJIN_TEST);
        expect(createdWallet.networkGenerationHash).to.be.equal('test');
    });

    it('should find account account with name', () => {
        const walletName = 'testWallet';
        const walletPassword = '123123123';
        const networkType = NetworkType.MIJIN_TEST;
        const simpleWallet = SimpleWallet.create(walletName, new Password(walletPassword), networkType);

        const url = 'http://localhost:1234';

        const networkGenerationHash = 'test';
        const wallet = new Wallet(
            walletName,
            networkType,
            url,
            networkGenerationHash,
            simpleWallet.address,
            simpleWallet.encryptedPrivateKey);
        const mockWalletRepository = mock(WalletRepository);
        when(mockWalletRepository.find(walletName))
            .thenReturn(wallet);

        const walletService = new WalletService(instance(mockWalletRepository));
        const createdWallet = walletService.getWallet(walletName);
        if (createdWallet instanceof Wallet) {
            expect(createdWallet.name).to.be.equal(walletName);
            expect(createdWallet.url).to.be.equal(url);
            expect(createdWallet.networkType).to.be.equal(NetworkType.MIJIN_TEST);
            expect(createdWallet.networkGenerationHash).to.be.equal(networkGenerationHash);
        }
    });

    it('should return undefined when no account found for name', () => {
        const mockWalletRepository = mock(WalletRepository);
        when(mockWalletRepository.find('no_name'))
            .thenThrow(new Error('wallet default not found'));

        const walletService = new WalletService(instance(mockWalletRepository));
        expect(() => {
            walletService.getWallet('no_name');
        }).to.throw(Error);
    });

    it('should get current wallet', () => {
        const walletName = 'testWallet';
        const walletPassword = '123123123';
        const networkType = NetworkType.MIJIN_TEST;
        const simpleWallet = SimpleWallet.create(walletName, new Password(walletPassword), networkType);
        const url = 'http://localhost:1234';

        const networkGenerationHash = 'test';
        const wallet = new Wallet(walletName,
            networkType,
            url,
            networkGenerationHash,
            simpleWallet.address,
            simpleWallet.encryptedPrivateKey);
        const mockWalletRepository = mock(WalletRepository);
        when(mockWalletRepository.find(walletName))
            .thenReturn(wallet);

        const walletService = new WalletService(instance(mockWalletRepository));
        walletService.setDefaultWallet(wallet.name);
        const currentWallet = walletService.getDefaultWallet();
        if (currentWallet instanceof Wallet) {
            expect(currentWallet.name).to.be.equal(walletName);
        }
    });
});
