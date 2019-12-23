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
import {Account, Address, Password} from 'nem2-sdk';
import * as readlineSync from 'readline-sync';
import {Profile} from './model/profile';
import {OptionsResolver} from './options-resolver';
import {ProfileRepository} from './respository/profile.repository';
import {ProfileService} from './service/profile.service';
import {PasswordValidator} from './validators/password.validator';

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
        try {
            if (options.profile) {
                return this.profileService.findProfileNamed(options.profile);
            }
            return this.profileService.getDefaultProfile();
        } catch (err) {
            throw new ExpectedError('Can\'t retrieve the current profile.\n' +
            'Use \'nem2-cli profile list\' to check whether the profile exist, ' +
            'if not, use \'nem2-cli profile create\' to create a new profile.');
        }
    }

    public getAccount(options: ProfileOptions): Account {
        const profile = this.getProfile(options);

        const password = options.password || readlineSync.question('Enter your wallet password: ');
        new PasswordValidator().validate(password);
        const passwordObject = new Password(password);

        if (!profile.isPasswordValid(passwordObject)) {
            throw new ExpectedError('The password you provided does not match your account password');
        }

        return profile.simpleWallet.open(passwordObject);
    }

    public getAccountAndProfile(options: ProfileOptions): {account: Account, profile: Profile} {
        const profile = this.getProfile(options);
        const account = this.getAccount(options);
        return { account, profile };
    }

    public getAddress(options: ProfileOptions): Address {
        const profile = this.getProfile(options);

        return Address.createFromRawAddress(
            OptionsResolver(options,
                'address',
                () => profile.address.pretty(),
                'Introduce an address: '));
    }

    protected setDefaultProfile(options: ProfileOptions) {
        try {
            this.profileService.setDefaultProfile(options.profile);
        } catch (err) {
            throw new ExpectedError('Can\'t set the profile [' + options.profile + '] as the default profile\n.' +
                'Use \'nem2-cli profile list\' to check whether the profile exist, ' +
                'if not, use \'nem2-cli profile create\' to create a profile.');
        }
    }
}

export class ProfileOptions extends Options {
    @option({
        description: '(Optional) Select between your profiles, by providing a profile name.',
    })
    profile: string;

    @option({
        flag: 'p',
        description: '(Optional) Profile password',
        validator: new PasswordValidator(),
    })
    password: string;
}
