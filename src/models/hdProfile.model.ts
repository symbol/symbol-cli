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

import { Crypto, SimpleWallet } from 'symbol-sdk';

import { DerivationService } from '../services/derivation.service';
import { NetworkCurrency } from './networkCurrency.model';
import { CURRENT_PROFILE_VERSION, Profile, ProfileType } from './profile.model';
import { HdProfileCreation } from './profileCreation.types';
import { HdProfileDTO } from './profileDTO.types';

/**
 * Hd Profile model
 * @export
 * @class HdProfile
 * @extends {Profile}
 */
export class HdProfile extends Profile {
    /**
     * Creates a new HD Profile from a DTO
     * @static
     * @param {HdProfileDTO} DTO
     * @returns {HdProfile}
     */
    public static createFromDTO(DTO: HdProfileDTO): HdProfile {
        return new HdProfile(
            SimpleWallet.createFromDTO(DTO.simpleWallet),
            DTO.url,
            DTO.networkGenerationHash,
            NetworkCurrency.createFromDTO(DTO.networkCurrency),
            DTO.version,
            DTO.type as ProfileType,
            DTO.default as '0' | '1',
            DTO.encryptedPassphrase,
            DTO.path,
        );
    }

    /**
     * Creates a new HD Profile
     * @static
     * @param {HdProfileCreation} args
     * @returns
     */
    public static create(args: HdProfileCreation) {
        const path = DerivationService.getPathFromPathNumber(args.pathNumber);
        const privateKey = DerivationService.getPrivateKeyFromMnemonic(args.mnemonic, args.pathNumber);
        const simpleWallet = SimpleWallet.createFromPrivateKey(args.name, args.password, privateKey, args.networkType);
        return new HdProfile(
            simpleWallet,
            args.url,
            args.generationHash,
            args.networkCurrency,
            CURRENT_PROFILE_VERSION,
            'HD',
            args.isDefault ? '1' : '0',
            Crypto.encrypt(args.mnemonic, args.password.value),
            path,
        );
    }

    /**
     * Creates an instance of HdProfile.
     * @param {SimpleWallet} simpleWallet
     * @param {string} url
     * @param {string} networkGenerationHash
     * @param {NetworkCurrency} networkCurrency
     * @param {number} version
     * @param {ProfileType} type
     * @param {('0' | '1')} isDefault
     * @param {string} encryptedPassphrase
     * @param {string} path
     */
    private constructor(
        public readonly simpleWallet: SimpleWallet,
        public readonly url: string,
        public readonly networkGenerationHash: string,
        public readonly networkCurrency: NetworkCurrency,
        public readonly version: number,
        public readonly type: ProfileType,
        public readonly isDefault: '0' | '1',
        public readonly encryptedPassphrase: string,
        public readonly path: string,
    ) {
        super(simpleWallet, url, networkGenerationHash, networkCurrency, version, type, isDefault);

        this.table = this.getBaseTable();
        this.table.push(['Path', `Path n. ${this.pathNumber + 1} (${this.path})`]);
    }

    /**
     * Gets path number
     * @returns {(number | null)}
     */
    public get pathNumber(): number {
        return DerivationService.getPathIndexFromPath(this.path);
    }

    /**
     * Creates a DTO
     * @returns {HdProfileDTO}
     */
    public toDTO(): HdProfileDTO {
        return {
            simpleWallet: this.simpleWallet.toDTO(),
            url: this.url,
            networkGenerationHash: this.networkGenerationHash,
            networkCurrency: this.networkCurrency.toDTO(),
            version: this.version,
            default: this.isDefault,
            type: this.type,
            encryptedPassphrase: this.encryptedPassphrase,
            path: this.path,
        };
    }
}
