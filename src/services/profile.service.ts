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
import {Profile} from '../models/profile.model'
import {ProfileRepository} from '../respositories/profile.repository'
import {SimpleWallet} from 'symbol-sdk'
import {NetworkCurrency} from '../models/networkCurrency.model'

/**
 * Profile service
 */
export class ProfileService {
    private readonly profileRepository: ProfileRepository

    /**
     * Constructor
     * @param {ProfileRepository} profileRepository
     */
    constructor(profileRepository: ProfileRepository) {
        this.profileRepository = profileRepository
    }

    /**
     * Creates a new profile from a SimpleWallet.
     * @param {SimpleWallet} simpleWallet - Wallet object with sensitive information.
     * @param {string} url - Node URL by default.
     * @param {string} networkGenerationHash - Network's generation hash.
     * @param {NetworkCurrency} networkCurrency - Network currency.
     * @returns {Profile}
     */
    createNewProfile(
        simpleWallet: SimpleWallet,
        url: string,
        networkGenerationHash: string,
        networkCurrency: NetworkCurrency,
    ): Profile {
        return this.profileRepository.save(simpleWallet, url, networkGenerationHash, networkCurrency)
    }

    /**
     * Find profile by name.
     * @param {string} name - Profile name.
     * @returns {Profile}
     */
    findProfileNamed(name: string): Profile {
        return this.profileRepository.find(name)
    }

    /**
     * Gets all profiles.
     * @returns {Profile[]}
     */
    findAllProfiles(): Profile[] {
        return this.profileRepository.all()
    }

    /**
     * Sets a profile as the default one.
     * @param {string} name - Profile name.
     */
    setDefaultProfile(name: string) {
        this.profileRepository.setDefault(name)
    }

    /**
     * Gets the profile set as default.
     * @returns {Profile}
     */
    getDefaultProfile(): Profile {
        return this.profileRepository.getDefaultProfile()
    }
}
