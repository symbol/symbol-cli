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
import {Spinner} from 'cli-spinner';
import {Command, ExpectedError, option, Options} from 'clime';
import {Profile} from './model/profile';
import {ProfileRepository} from './respository/profile.repository';
import {ProfileService} from './service/profile.service';

export abstract class ProfileCommand extends Command {
    private readonly profileService: ProfileService;
    public spinner = new Spinner('processing.. %s');

    constructor() {
        super();
        const profileRepository = new ProfileRepository('.nem2rc.json');
        this.profileService = new ProfileService(profileRepository);
        this.spinner.setSpinnerString('|/-\\');
    }

    public getProfile(options: ProfileOptions): Profile {
        const profileName = options.profile ? options.profile :
            (process.env.NEM2_PROFILE !== undefined ? process.env.NEM2_PROFILE : 'default') as string;
        try {
            return this.profileService.findProfileNamed(profileName);
        } catch (err) {
            throw new ExpectedError(options.profile ? ('No profile found with name: ' + options.profile) :
                'To start using the nem2-cli create a default profile using: nem2-cli profile create --privatekey your_private_key' +
                ' --network network --url http://localhost:3000');
        }
    }

    public setCurProfile(options: ProfileOptions): Profile {
        const profileName = options.profile;
        try {
            return this.profileService.changeCurProfile(profileName);
        } catch (err) {
            throw new ExpectedError(options.profile ? 'Set current profile fail' :
            'Illegal profile name : ' + options.profile);
        }
    }

    public getCurProfile(): Profile {
        try {
            return this.profileService.getCurProfile();
        } catch (err) {
            throw new ExpectedError('Get current profile fail');
        }
    }
}

export class ProfileOptions extends Options {
    @option({
        description: '(Optional) Select between your profiles, by providing a profile name',
    })
    profile: string;
}
