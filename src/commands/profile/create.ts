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
import chalk from 'chalk';
import {Command, command, metadata, option, Options} from 'clime';
import {BlockHttp, NetworkType, Password, SimpleWallet} from 'nem2-sdk';
import * as readlineSync from 'readline-sync';
import {OptionsResolver} from '../../options-resolver';
import {ProfileRepository} from '../../respository/profile.repository';
import {ProfileService} from '../../service/profile.service';
import {NetworkValidator} from '../../validators/network.validator';
import {PasswordValidator} from '../../validators/password.validator';
import {PrivateKeyValidator} from '../../validators/privateKey.validator';

export class CommandOptions extends Options {
    @option({
        flag: 'p',
        description: 'Account private key.',
        validator: new PrivateKeyValidator(),
    })
    privateKey: string;

    @option({
        flag: 'n',
        description: 'Network Type. Example: MAIN_NET, TEST_NET, MIJIN, MIJIN_TEST.',
        validator: new NetworkValidator(),
    })
    network: string;

    @option({
        flag: 'u',
        description: 'NEM2 Node URL. Example: http://localhost:3000',
    })
    url: string;

    @option({
        description: 'Profile name.',
    })
    profile: string;

    @option({
        flag: 'p',
        description: '(Optional) Account password',
        validator: new PasswordValidator(),
    })
    password: string;

    getNetwork(network: any): NetworkType {
        new NetworkValidator().validate(network);
        return parseInt(NetworkType[network], 10);
    }
}

@command({
    description: 'Create a new profile',
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

        const url = OptionsResolver(options,
            'url',
            () => undefined,
            'Introduce NEM 2 Node URL. (Example: http://localhost:3000): ');

        let profileName: string;
        if (options.profile) {
            profileName = options.profile;
        } else {
            profileName = readlineSync.question('Insert profile name: ');
        }
        profileName.trim();

        const password = OptionsResolver(options,
            'password',
            () => undefined,
            'Enter your wallet password: ');

        new PasswordValidator().validate(password);
        const passwordObject = new Password(password);

        const simpleWallet: SimpleWallet = SimpleWallet.createFromPrivateKey(
            profileName,
            passwordObject,
            OptionsResolver(options,
                'privateKey',
                () => undefined,
                'Introduce your private key: '),
            networkType,
        );

        const blockHttp = new BlockHttp(url);
        blockHttp.getBlockByHeight('1')
            .subscribe((block) => {
                if (block.networkType !== networkType) {
                    console.log('The network provided and the node network don\'t match.');
                } else {
                    const profile = this.profileService.createNewProfile(simpleWallet,
                        url as string,
                        block.generationHash);
                    if (readlineSync.keyInYN('Do you want to set the account as the default profile?')) {
                        this.profileService.setDefaultProfile(profileName);
                    }
                    console.log(chalk.green('\nProfile stored correctly\n') + profile.toString() + '\n');
                }
            }, (ignored) => {
                let error = '';
                error += chalk.red('Error');
                error += ' Check if you can reach the NEM2 url provided: ' + url + '/block/1';
                console.log(error);
            });
    }
}
