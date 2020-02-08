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
import chalk from 'chalk'
import { Spinner } from 'cli-spinner'
import * as Table from 'cli-table3'
import { HorizontalTable } from 'cli-table3'
import { Command, ExpectedError, option } from 'clime'
import { Account, NetworkType, Password, SimpleWallet } from 'nem2-sdk'
import { ProfileRepository } from '../respositories/profile.repository'
import { ProfileService } from '../services/profile.service'
import { ProfileOptions } from './profile.command'
import { Profile } from '../models/profile'
/**
 * Update profile options.
 */
export class UpdateProfileOptions extends ProfileOptions {

    @option({
        flag: 'u',
        description: 'Node url.',
    })
    url: string

    @option({
        flag: 'n',
        description: 'New profile name.',
    })
    newName: string

}

/**
 * Base command class to update the profile.
 */
export abstract class UpdateProfileCommand extends Command {
    public spinner = new Spinner('processing.. %s')
    private readonly profileService: ProfileService

    /**
     * Constructor.
     */
    protected constructor(fileUrl?: string) {
        super()
        const profileRepository = new ProfileRepository(fileUrl || '.nem2rc.json')
        this.profileService = new ProfileService(profileRepository)
        this.spinner.setSpinnerString('|/-\\')
    }

    /**
     * Gets profile by name.
     * @param {ProfileOptions} options - The  attribute "profile" should include the name.
     * @throws {ExpectedError}
     * @returns {Profile}
     */
    protected getProfile(options: ProfileOptions): Profile {
        try {
            if (options.profile) {
                return this.profileService.findProfileNamed(options.profile)
            }
            return this.profileService.getDefaultProfile()
        } catch (err) {
            throw new ExpectedError('Can\'t retrieve the current profile.' +
            'Use \'nem2-cli profile list\' to check whether the profile exist, ' +
            'if not, use \'nem2-cli profile create\' to create a new profile')
        }
    }

    protected updateProfile(originName: string, newName: string, newUrl: string): boolean {
        return this.profileService.updateProfile(originName, newName, newUrl)
    }
}
