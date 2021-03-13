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

import { ExtendedKey, MnemonicPassPhrase, Network, Wallet } from 'symbol-hd-wallets';
import { NetworkType } from 'symbol-sdk';

const MIN_PATH_NUMBER = 0;
const MAX_PATH_NUMBER = 9;

export class DerivationService {
    /**
     * Returns a path given a path number
     * @static
     * @param {number} pathNumber
     * @param {NetworkType} networkType
     * @returns {string}
     */
    public static getPathFromPathNumber(pathNumber: number, networkType: NetworkType): string {
        const index = parseInt(`${pathNumber}`, 10);

        if (index < MIN_PATH_NUMBER || index > MAX_PATH_NUMBER) {
            throw new Error(`The path index should be between ${MIN_PATH_NUMBER} and ${MAX_PATH_NUMBER}`);
        }

        if (!index && index !== 0) {
            throw new Error(`The given path index is invalid (${pathNumber})`);
        }

        return `m/44'/${DerivationService.getPathCoinType(networkType)}'/${pathNumber}'/0'/0'`;
    }

    /**
     * Return the address path index of a path
     * @static
     * @param {string} path
     * @returns {number}
     */
    public static getPathIndexFromPath(path: string): number {
        return parseInt(path.split('/')[3], 10);
    }

    /**
     * Returs a private key from a mnemonic
     * @static
     * @param {string} mnemonic
     * @param {number} pathNumber
     * @param {NetworkType} networkType
     * @returns {string}
     */
    public static getPrivateKeyFromMnemonic(mnemonic: string, pathNumber: number, networkType: NetworkType): string {
        return this.getPrivateKeyFromMnemonicWithCurve(mnemonic, pathNumber, networkType, Network.SYMBOL);
    }

    /**
     * Returs a private key from a mnemonic(optin)
     * @static
     * @param {string} mnemonic
     * @param {number} pathNumber
     * @param {NetworkType} networkType
     * @returns {string}
     */
    public static getPrivateKeyFromOptinMnemonic(mnemonic: string, pathNumber: number, networkType: NetworkType): string {
        return this.getPrivateKeyFromMnemonicWithCurve(mnemonic, pathNumber, networkType, Network.BITCOIN);
    }

    /**
     * Returs a private key from a mnemonic for a specific curve
     * @static
     * @param {string} mnemonic
     * @param {number} pathNumber
     * @param {NetworkType} networkType
     * @param {Network} curve
     * @returns {string}
     */
    public static getPrivateKeyFromMnemonicWithCurve(
        mnemonic: string,
        pathNumber: number,
        networkType: NetworkType,
        curve: Network,
    ): string {
        const path = this.getPathFromPathNumber(pathNumber, networkType);
        const seed = new MnemonicPassPhrase(mnemonic).toSeed().toString('hex');
        const extendedKey = ExtendedKey.createFromSeed(seed, curve);
        return new Wallet(extendedKey).getChildAccountPrivateKey(path);
    }

    /**
     * Get coin type in HD path by network type
     * @param networkType Symbol network type
     * @returns {string}
     */
    public static getPathCoinType(networkType: NetworkType) {
        return networkType === NetworkType.MAIN_NET ? `4343` : `1`;
    }
}
