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
import {SimpleWallet} from 'nem2-sdk';
import {Profile} from '../models/profile';

/**
 * Profile repository
 */
export class ProfileRepository {

    /**
     * Constructor
     * @param {string} fileUrl - File path where profiles are saved.
     */
    constructor(private readonly fileUrl: string) {
    }

    /**
     * Find profile by name.
     * @param {string} name - Profile name.
     * @throws {Error}
     * @returns {Profile}
     */
    public find(name: string): Profile {
        const profiles = this.getProfiles();
        if (profiles[name]) {
            return Profile.createFromDTO(profiles[name]);
        }
        throw new Error(`${name} not found`);
    }

    /**
     * Gets all profiles.
     * @returns {Profile[]}
     */
    public all(): Profile[] {
        const profiles = this.getProfiles();
        const list: Profile[] = [];
        for (const name in profiles) {
            if (profiles.hasOwnProperty(name)) {
                list.push(Profile.createFromDTO(profiles[name]));
            }
        }
        return list;
    }

    /**
     * Saves a new profile from a SimpleWallet.
     * @param {SimpleWallet} simpleWallet - Wallet object with sensitive information.
     * @param {string} url - Node URL by default.
     * @param {string} networkGenerationHash - Network's generation hash.
     * @returns {Profile}
     */
    public save(simpleWallet: SimpleWallet, url: string, networkGenerationHash: string): Profile {
        const profiles = this.getProfiles();
        const {name, network} = simpleWallet;
        if (profiles.hasOwnProperty(name)) {
            throw new Error(`A profile named ${name} already exists.`);
        }
        profiles[name] = {
            networkType: network,
            simpleWallet,
            url,
            networkGenerationHash,
            default: '0',
        };
        this.saveProfiles(profiles);
        return new Profile(simpleWallet, url, networkGenerationHash);
    }

    /**
     * Sets a profile as the default one.
     * @param {string} name - Profile name.
     * @throws {Error}
     */
    public setDefault(name: string) {
        const profiles = this.getProfiles();
        if (profiles.hasOwnProperty(name)) {
            for (const item in profiles) {
                if (item !== name) {
                    profiles[item].default = '0';
                } else {
                    profiles[item].default = '1';
                }
            }
            this.saveProfiles(profiles);
        } else {
            throw new Error(`${name} not found`);
        }
    }

    /**
     * Gets the default profile.
     * @returns {Profile}
     */
    public getDefaultProfile(): Profile {
        const profiles = this.getProfiles();
        let defaultProfile = '';
        for (const name in profiles) {
            if ('1' === profiles[name].default) {
                defaultProfile = name;
            }
        }
        if ('' === defaultProfile) {
            throw new Error('default profile not found');
        }
        return this.find(defaultProfile);
    }

    /**
     * Get all profiles as JSON objects.
     * @returns {object}
     */
    private getProfiles(): any {
        let accounts = {};
        try {
            accounts = JSON.parse(fs.readFileSync(require('os').homedir() + '/' + this.fileUrl, 'utf-8'));
        } catch (err) {
            fs.writeFileSync(require('os').homedir() + '/' + this.fileUrl, '{}', 'utf-8');
        }
        return accounts;
    }

    /**
     * Save profiles from JSON.
     * @param {JSON} profiles
     */
    private saveProfiles(profiles: JSON) {
        fs.writeFileSync(require('os').homedir() + '/' + this.fileUrl, JSON.stringify(profiles), 'utf-8');
    }
}
