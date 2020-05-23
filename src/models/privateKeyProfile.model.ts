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

import { SimpleWallet } from 'symbol-sdk';

import { NetworkCurrency } from './networkCurrency.model';
import { CURRENT_PROFILE_VERSION, Profile, ProfileType } from './profile.model';
import { PrivateKeyProfileCreation } from './profileCreation.types';
import { ProfileDTOBase } from './profileDTO.types';

export class PrivateKeyProfile extends Profile {
    /**
     * Creates a new Private Key Profile from a DTO
     * @static
     * @param {ProfileDTOBase} DTO
     * @returns {PrivateKeyProfile}
     */
    public static createFromDTO(DTO: ProfileDTOBase): PrivateKeyProfile {
        return new PrivateKeyProfile(
            SimpleWallet.createFromDTO(DTO.simpleWallet),
            DTO.url,
            DTO.networkGenerationHash,
            NetworkCurrency.createFromDTO(DTO.networkCurrency),
            DTO.version,
            DTO.type as ProfileType,
            DTO.default as '0' | '1',
        );
    }

    /**
     * Creates a new Private Key Profile
     * @static
     * @param {PrivateKeyProfileCreation} args
     * @returns {PrivateKeyProfile}
     */
    public static create(args: PrivateKeyProfileCreation): PrivateKeyProfile {
        const simpleWallet = SimpleWallet.createFromPrivateKey(args.name, args.password, args.privateKey, args.networkType);

        return new PrivateKeyProfile(
            simpleWallet,
            args.url,
            args.generationHash,
            args.networkCurrency,
            CURRENT_PROFILE_VERSION,
            'PrivateKey',
            args.isDefault ? '1' : '0',
        );
    }

    /**
     * Creates an instance of PrivateKeyProfile.
     * @param {SimpleWallet} simpleWallet
     * @param {string} url
     * @param {string} networkGenerationHash
     * @param {NetworkCurrency} networkCurrency
     * @param {number} version
     * @param {ProfileType} type
     * @param {('0' | '1')} isDefault
     */
    private constructor(
        public readonly simpleWallet: SimpleWallet,
        public readonly url: string,
        public readonly networkGenerationHash: string,
        public readonly networkCurrency: NetworkCurrency,
        public readonly version: number,
        public readonly type: ProfileType,
        public readonly isDefault: '0' | '1',
    ) {
        super(simpleWallet, url, networkGenerationHash, networkCurrency, version, type, isDefault);

        this.table = this.getBaseTable();
    }

    /**
     * Creates a DTO
     * @returns {ProfileDTOBase}
     */
    public toDTO(): ProfileDTOBase {
        return {
            simpleWallet: this.simpleWallet.toDTO(),
            url: this.url,
            networkGenerationHash: this.networkGenerationHash,
            networkCurrency: this.networkCurrency.toDTO(),
            version: this.version,
            default: this.isDefault,
            type: this.type,
        };
    }
}
