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

export class NetworkValidator implements Validator<string> {
    validate(value: string, context: ValidationContext): void {
        if (!(value === 'MIJIN' || value === 'MIJIN_TEST' || value === 'MAIN_NET' || value === 'TEST_NET')) {
            throw new ExpectedError('it should be a valid network type');
        }
    }
}

export class CommandOptions extends Options {
    @option({
        flag: 's',
        description: '(Optional) Save profile',
        toggle: true,
    })
    save: any;

    @option({
        flag: 'u',
        description: '(Optional) When saving profile, provide a NEM2 Node URL. Example: http://localhost:3000',
    })
    url: string;

    @option({
        description: '(Optional) When saving profile you can add profile name, if not will be stored as default',
    })
    profile: string;

    @option({
        flag: 'n',
        description: 'Network Type: MAIN_NET, TEST_NET, MIJIN, MIJIN_TEST',
        validator: new NetworkValidator(),
    })
    network: string;

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
    description: 'Generate new accounts',
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

        const account = Account.generateNewAccount(networkType);

        let text = chalk.green('New Account:\t') + account.address.pretty() + '\n';
        text += 'Public Key:\t' + account.publicKey + '\n';
        text += 'Private Key:\t' + account.privateKey + '\n';

        if (!options.save && readlineSync.keyInYN('Do you want to save it?')) {
            options.save = true;
        }

        if (options.save) {
            const url = OptionsResolver(options,
                'url',
                () => undefined,
                'Introduce NEM 2 Node URL. (Example: http://localhost:3000): ').trim();

            let profile: string;
            if (options.profile) {
                profile = options.profile;
            } else {
                const tmp = readlineSync
                    .question('Insert profile name ' +
                        '(blank means default and it could overwrite the previous profile): ');
                if (tmp === '') {
                    profile = 'default';
                } else {
                    profile = tmp;
                }
            }
            profile = profile.trim();

            const networkHttp = new NetworkHttp(url);
            const blockHttp = new BlockHttp(url);

            forkJoin(networkHttp.getNetworkType(), blockHttp.getBlockByHeight(1))
                .subscribe((res) => {
                    if (res[0] !== networkType) {
                        console.log('Network provided and node network don\'t match');
                    } else {
                        this.profileService.createNewProfile(account,
                            url as string,
                            profile,
                            res[1].generationHash);
                        text += chalk.green('\nStored ' + profile + ' profile');
                        console.log(text);
                    }
                }, (err) => {
                    let error = '';
                    error += chalk.red('Error');
                    error += ' Provide a valid NEM2 Node URL. Example: http://localhost:3000';
                    console.log(error);
                });
        } else {
            console.log(text);
        }

    }
}
