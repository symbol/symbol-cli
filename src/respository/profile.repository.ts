/*
 *
 * Copyright 2019 NEM
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
import {Account} from 'nem2-sdk';
import {Profile} from '../model/profile';

export class ProfileRepository {

    constructor(private readonly fileUrl: string) {

    }

    public find(name: string): Profile {
        const profiles = this.getProfiles();
        if (profiles[name]) {
            return new Profile(
                Account.createFromPrivateKey(profiles[name].privateKey, profiles[name].networkType),
                profiles[name].networkType,
                profiles[name].url,
                name,
                profiles[name].networkGenerationHash);
        }
        throw new Error(`${name} not found`);
    }

    public all(): Profile[] {
        const profiles = this.getProfiles();
        const list: Profile[] = [];
        for (const name in profiles) {
            list.push(new Profile(
                Account.createFromPrivateKey(profiles[name].privateKey, profiles[name].networkType),
                profiles[name].networkType,
                profiles[name].url,
                name,
                profiles[name].networkGenerationHash));
        }
        return list;
    }

    public save(account: Account, url: string, name: string, networkGenerationHash: string): Profile {
        const profiles = this.getProfiles();
        profiles[name] = {privateKey: account.privateKey, networkType: account.address.networkType, url, networkGenerationHash};
        this.saveProfiles(profiles);
        return new Profile(account, account.address.networkType, url, name, networkGenerationHash);
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
