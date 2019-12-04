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
import * as fs from 'fs';
import { Address, SimpleWallet } from 'nem2-sdk';
import { Wallet } from '../model/wallet';

export class WalletRepository {
    constructor(
        private readonly fileUrl: string = '.nem2rc-wallet.json',
    ) {

    }

    public find(name: string): Wallet {
        const wallets = this.getWallets();
        if (wallets[name]) {
            return new Wallet(
                wallets[name].name,
                wallets[name].network,
                wallets[name].url,
                wallets[name].networkGenerationHash,
                Address.createFromRawAddress(wallets[name].address),
                wallets[name].encryptedPrivateKey,
            );
        }
        throw new Error(`${name} not found`);
    }

    public findAll(): Wallet[] {
        const wallets = this.getWallets();
        const result: Wallet[] = [];
        Object.keys(wallets).map((key: any) => {
            const item = wallets[key];
            const tempWallet = new Wallet(
                item.name,
                item.network,
                item.url,
                item.networkGenerationHash,
                Address.createFromRawAddress(item.address),
                item.encryptedPrivateKey,
            );
            result.push(tempWallet);
        });
        return result;
    }

    public save(simpleWallet: SimpleWallet, url: string, networkGenerationHash: string): Wallet {
        const wallets = this.getWallets();
        wallets[simpleWallet.name] = {
            name: simpleWallet.name,
            network: simpleWallet.network,
            address: simpleWallet.address.plain(),
            url,
            networkGenerationHash,
            encryptedPrivateKey: simpleWallet.encryptedPrivateKey,
            default: '0',
        };

        this.saveWallets(wallets);
        return new Wallet(
            simpleWallet.name,
            simpleWallet.network,
            url,
            networkGenerationHash,
            simpleWallet.address,
            simpleWallet.encryptedPrivateKey,
        );
    }

    public checkExist(name: string): boolean {
        const wallets = this.getWallets();
        if (Object.keys(wallets).includes(name)) {
            return true;
        }
        return false;
    }

    public setDefaultWallet(name: string): void {
        const wallets = this.getWallets();
        for (const item in wallets) {
            if (wallets[item].name === name) {
                wallets[item].default = '1';
            } else {
                wallets[item].default = '0';
            }
        }
        this.saveWallets(wallets);
    }

    public getDefaultWallet(): Wallet | undefined {
        const wallets = this.getWallets();
        for (const key in wallets) {
            if ('1' === wallets[key].default) {
                const wallet = new Wallet(
                    wallets[key].name,
                    wallets[key].network,
                    wallets[key].url,
                    wallets[key].networkGenerationHash,
                    Address.createFromRawAddress(wallets[key].address),
                    wallets[key].encryptedPrivateKey,
                );
                return wallet;
            }
        }
        return undefined;
    }

    private getWallets(): any {
        let wallets = {};
        try {
            wallets = JSON.parse(fs.readFileSync(require('os').homedir() + '/' + this.fileUrl, 'utf-8') as string);
        } catch (err) {
            fs.writeFileSync(require('os').homedir() + '/' + this.fileUrl, '{}', 'utf-8');
        }
        return wallets;
    }

    private saveWallets(wallets: JSON) {
        fs.writeFileSync(require('os').homedir() + '/' + this.fileUrl, JSON.stringify(wallets), 'utf-8');
    }
}
