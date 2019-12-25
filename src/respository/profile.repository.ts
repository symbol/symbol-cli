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
import {Address, SimpleWallet} from 'nem2-sdk';
import {Profile} from '../model/profile';

export class ProfileRepository {

    constructor(private readonly fileUrl: string) {

    }

    public find(name: string): Profile {
        const profiles = this.getProfiles();
        if (profiles[name]) {
            return Profile.createFromDTO(profiles[name]);
        }
        throw new Error(`${name} not found`);
    }

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

    public save(simpleWallet: SimpleWallet, url: string, networkGenerationHash: string): Profile {
        const profiles = this.getProfiles();
        const {name, network} = simpleWallet;
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

    public setDefaultProfile(name: string) {
        const profiles = this.getProfiles();
        if (profiles[name]) {
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

    public getDefaultProfile(): Profile {
        const profiles = this.getProfiles();
        let defaultProfile = '';
        for (const name in profiles) {
            if ('1' === profiles[name].default) {
                defaultProfile = name;
            }
        }
        return this.find(defaultProfile);
    }

    private getProfiles(): any {
        let accounts = {};
        try {
            accounts = JSON.parse(fs.readFileSync(require('os').homedir() + '/' + this.fileUrl, 'utf-8') as string);
        } catch (err) {
            fs.writeFileSync(require('os').homedir() + '/' + this.fileUrl, '{}', 'utf-8');
        }
        return accounts;
    }

    private saveProfiles(profiles: JSON) {
        fs.writeFileSync(require('os').homedir() + '/' + this.fileUrl, JSON.stringify(profiles), 'utf-8');
    }
}
