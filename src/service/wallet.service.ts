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
import { Account, Crypto, SimpleWallet, WalletAlgorithm } from 'nem2-sdk';
import { Wallet } from '../model/wallet';
import { WalletRepository } from '../respository/wallet.repository';

export class WalletService {
    private readonly walletRepository: WalletRepository;

    constructor(walletRepository: WalletRepository) {
        this.walletRepository = walletRepository;
    }

    public static getAccount(wallet: Wallet, password: string): Account {
        const { encryptedKey, iv } = wallet.encryptedPrivateKey;
        const common = { password, privateKey: '' };
        const walletInfo = { encrypted: encryptedKey, iv };
        Crypto.passwordToPrivateKey(common, walletInfo, WalletAlgorithm.Pass_bip32);
        const privateKey = common.privateKey;
        const account = Account.createFromPrivateKey(privateKey, wallet.networkType);
        return account;
    }

    createWallet(simpleWallet: SimpleWallet, url: string, networkGenerationHash: string): Wallet {
        return this.walletRepository.save(simpleWallet, url, networkGenerationHash);
    }

    getWallet(name: string): Wallet {
        return this.walletRepository.find(name);
    }

    getAllWallet(): Wallet[] {
        return this.walletRepository.findAll();
    }

    setDefaultWallet(name: string) {
        this.walletRepository.setDefaultWallet(name);
    }

    getDefaultWallet(): Wallet | undefined {
        return this.walletRepository.getDefaultWallet();
    }

    checkWalletExist(name: string): boolean {
        return this.walletRepository.checkExist(name);
    }
}
