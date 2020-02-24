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
import {Spinner} from 'cli-spinner'
import * as Table from 'cli-table3'
import {HorizontalTable} from 'cli-table3'
import {Command, ExpectedError, option} from 'clime'
import {Account, NetworkType, Password, SimpleWallet} from 'symbol-sdk'
import {ProfileRepository} from '../respositories/profile.repository'
import {ProfileService} from '../services/profile.service'
import {ProfileOptions} from './profile.command'

export class AccountCredentialsTable {
    private readonly table: HorizontalTable

    constructor(
        public readonly account: Account,
        public readonly password?: Password) {

        this.table = new Table({
            style: { head: ['cyan'] },
            head: ['Property', 'Value'],
        }) as HorizontalTable
        this.table.push(
            ['Address', account.address.pretty()],
            ['Public Key', account.publicKey],
            ['Private Key', account.privateKey],
        )
        if (password) {
            this.table.push(['Password', password.value])
        }
    }

    toString(): string {
        let text = ''
        text += '\n' + chalk.green('Account') + '\n'
        text += this.table.toString()
        return text
    }
}

/**
 * Base command class to create a new profile.
 */
export abstract class CreateProfileCommand extends Command {
    public spinner = new Spinner('processing.. %s')
    private readonly profileService: ProfileService

    /**
     * Constructor.
     */
    protected constructor(fileUrl?: string) {
        super()
        const profileRepository = new ProfileRepository(fileUrl || '.symbolrc.json')
        this.profileService = new ProfileService(profileRepository)
        this.spinner.setSpinnerString('|/-\\')
    }

    /**
     * Creates a new profile.
     * @param {SimpleWallet} simpleWallet - The account credentials.
     * @param {NetworkType} networkType - The network type.
     * @param {string} url - The node URL.
     * @param {boolean} isDefault - If the profile has to be saved as default.
     * @param {string} generationHash - If the network generation hash.
     * @return {Profile}.
     */
    protected createProfile(simpleWallet: SimpleWallet,
                            networkType: NetworkType,
                            url: string,
                            isDefault: boolean,
                            generationHash: string) {
            let profile
            try {
                 profile = this.profileService.createNewProfile(simpleWallet,
                    url,
                    generationHash)
            } catch (ignored) {
                throw new ExpectedError('The profile [' + simpleWallet.name + '] already exists')
            }
            if (isDefault) {
                this.setDefaultProfile(simpleWallet.name)
            }
            return profile
    }

    /**
     * Sets a profile as default.
     * @param {string} profileName - The name of the profile to set as default.
     * @throws {ExpectedError}
     */
    protected setDefaultProfile(profileName: string) {
        try {
            this.profileService.setDefaultProfile(profileName)
        } catch (err) {
            throw new ExpectedError('Can\'t set the profile [' + profileName + '] as the default profile.' +
                'Use \'nem2-cli profile list\' to check whether the profile exist, ' +
                'if not, use \'nem2-cli profile create\' to create a profile')
        }
    }
}

/**
 * Monitor profile options.
 */
export class CreateProfileOptions extends ProfileOptions {

    @option({
        flag: 'u',
        description: '(Optional) When saving profile, provide a NEM2 Node URL. Example: http://localhost:3000',
    })
    url: string

    @option({
        flag: 'n',
        description: 'Network Type. (MAIN_NET, TEST_NET, MIJIN, MIJIN_TEST)',
    })
    network: string

    @option({
        flag: 'p',
        description: '(Optional) When saving profile, provide the password.',
    })
    password: string

    @option({
        flag: 'd',
        description: '(Optional) Set the profile as default.',
        toggle: true,
    })
    default: any

    @option({
        flag: 'g',
        description: '(Optional) Generation hash of the network. Necessary to create the profile offline.',
    })
    generationHash: string

}
