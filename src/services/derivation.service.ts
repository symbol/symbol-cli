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

import { ExtendedKey, MnemonicPassPhrase, Wallet } from 'symbol-hd-wallets';

const MIN_PATH_NUMBER = 0;
const MAX_PATH_NUMBER = 9;

export class DerivationService {
    /**
     * Returns a path given a path number
     * @static
     * @param {number} pathNumber
     * @returns {string}
     */
    public static getPathFromPathNumber(pathNumber: number): string {
        const index = parseInt(`${pathNumber}`, 10);

        if (index < MIN_PATH_NUMBER || index > MAX_PATH_NUMBER) {
            throw new Error(`The path index should be between ${MIN_PATH_NUMBER} and ${MAX_PATH_NUMBER}`);
        }

        if (!index && index !== 0) {
            throw new Error(`The given path index is invalid (${pathNumber})`);
        }

        return `m/44'/4343'/${pathNumber}'/0'/0'`;
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
     * Returs a private key from a mnemonic and a path index
     * @static
     * @param {string} mnemonic
     * @param {number} pathNumber
     * @returns {string}
     */
    public static getPrivateKeyFromMnemonic(mnemonic: string, pathNumber: number): string {
        const path = this.getPathFromPathNumber(pathNumber);
        const seed = new MnemonicPassPhrase(mnemonic).toSeed().toString('hex');
        const extendedKey = ExtendedKey.createFromSeed(seed);
        return new Wallet(extendedKey).getChildAccount(path).privateKey;
    }
}
