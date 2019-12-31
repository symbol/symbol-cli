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

/**
 * Base command class to use the stored profile.
 */
export abstract class ProfileCommand extends Command {
    public spinner = new Spinner('processing.. %s');
    private readonly profileService: ProfileService;

    /**
     * Constructor.
     */
    constructor() {
        super();
        const profileRepository = new ProfileRepository('.nem2rc.json');
        this.profileService = new ProfileService(profileRepository);
        this.spinner.setSpinnerString('|/-\\');
    }

    /**
     * Get profile by name.
     * @param {ProfileOptions} options - The  attribute "profile" should include the name.
     * @throws {ExpectedError}
     * @returns {Profile}
     */
    public getProfile(options: ProfileOptions): Profile {
        try {
            if (options.profile) {
                return this.profileService.findProfileNamed(options.profile);
            }
            return this.profileService.getDefaultProfile();
        } catch (err) {
            throw new ExpectedError('Can\'t retrieve the current profile.' +
            'Use \'nem2-cli profile list\' to check whether the profile exist, ' +
            'if not, use \'nem2-cli profile create\' to create a new profile');
        }
    }

    /**
     * Set a profile by default.
     * @param {ProfileOptions} options - The  attribute "profile" should include the name.
     * @throws {ExpectedError}
     */
    protected setDefaultProfile(options: ProfileOptions) {
        try {
            this.profileService.setDefaultProfile(options.profile);
        } catch (err) {
            throw new ExpectedError('Can\'t set the profile [' + options.profile + '] as the default profile.' +
                'Use \'nem2-cli profile list\' to check whether the profile exist, ' +
                'if not, use \'nem2-cli profile create\' to create a profile');
        }
    }
}

/**
 * Monitor profile options.
 */
export class ProfileOptions extends Options {
    @option({
        description: '(Optional) Select between your profiles, by providing a profile name.',
    })
    profile: string;
}
