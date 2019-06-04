/*
 *
 * Copyright 2018 NEM
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
import chalk from 'chalk';
import {Command, command, ExpectedError, metadata, option, Options, ValidationContext, Validator} from 'clime';
import {Account, BlockHttp, NetworkHttp, NetworkType} from 'nem2-sdk';
import * as readlineSync from 'readline-sync';
import {forkJoin} from 'rxjs';
import {OptionsResolver} from '../../options-resolver';
import {ProfileRepository} from '../../respository/profile.repository';
import {ProfileService} from '../../service/profile.service';

export class PrivateKeyValidator implements Validator<string> {
    validate(value: string, context: ValidationContext): void {
        if (value.length !== 64 || !/^[0-9a-fA-F]+$/.test(value)) {
            throw new ExpectedError('it private key should be a 64 characters hexadecimal string');
        }
    }
}

export class NetworkValidator implements Validator<string> {
    validate(value: string, context: ValidationContext): void {
        if (!(value === 'MIJIN' || value === 'MIJIN_TEST' || value === 'MAIN_NET' || value === 'TEST_NET')) {
            throw new ExpectedError('it should be a valid network type');
        }
    }
}

export class CommandOptions extends Options {
    @option({
        flag: 'p',
        description: 'Private key',
        validator: new PrivateKeyValidator(),
    })
    privatekey: string;

    @option({
        flag: 'n',
        description: 'Network Type: MAIN_NET, TEST_NET, MIJIN, MIJIN_TEST',
        validator: new NetworkValidator(),
    })
    network: string;

    @option({
        flag: 'u',
        description: 'NEM2 Node URL. Example: http://localhost:3000',
    })
    url: string;

    @option({
        description: '(Optional) profile name, if not private key will be stored as default',
    })
    profile: string;

    getNetwork(network: string): NetworkType {
        if (network === 'MAIN_NET') {
            return NetworkType.MAIN_NET;
        } else if (network === 'TEST_NET') {
            return NetworkType.TEST_NET;
        } else if (network === 'MIJIN') {
            return NetworkType.MIJIN;
        } else if (network === 'MIJIN_TEST') {
            return NetworkType.MIJIN_TEST;
        }
        throw new ExpectedError('Introduce a valid network type');
    }
}

@command({
    description: 'Configure an account',
})

export default class extends Command {
    private readonly profileService: ProfileService;

    constructor() {
        super();
        const profileRepository = new ProfileRepository('.nem2rc.json');
        this.profileService = new ProfileService(profileRepository);
    }

    @metadata
    execute(options: CommandOptions) {
        const networkType = options.getNetwork(OptionsResolver(options,
            'network',
            () => undefined,
            'Introduce network type (MIJIN_TEST, MIJIN, MAIN_NET, TEST_NET): '));

        let account: Account;
        try {
            account = Account.createFromPrivateKey(
                OptionsResolver(options,
                    'privatekey',
                    () => undefined,
                    'Introduce your private key: '),
                networkType);
        } catch (err) {
            throw new ExpectedError('Introduce a valid private key');
        }

        const url = OptionsResolver(options,
            'url',
            () => undefined,
            'Introduce NEM 2 Node URL. (Example: http://localhost:3000): ');

        let profileName: string;
        if (options.profile) {
            profileName = options.profile;
        } else {
            const tmp = readlineSync.question('Insert profile name (blank means default and it could overwrite the previous profile): ');
            if (tmp === '') {
                profileName = 'default';
            } else {
                profileName = tmp;
            }
        }
        profileName.trim();

        const networkHttp = new NetworkHttp(url);
        const blockHttp = new BlockHttp(url);

        forkJoin(networkHttp.getNetworkType(), blockHttp.getBlockByHeight(1))
            .subscribe((res) => {
                if (res[0] !== networkType) {
                    console.log('Network provided and node network don\'t match');
                } else {
                    const profile = this.profileService.createNewProfile(account,
                        url as string,
                        profileName,
                        res[1].generationHash);
                    console.log(chalk.green('\nProfile stored correctly\n') + profile.toString());
                }
            }, (err) => {
                let error = '';
                error += chalk.red('Error');
                error += ' Provide a valid NEM2 Node URL. Example: http://localhost:3000';
                console.log(error);
            });
    }

}
