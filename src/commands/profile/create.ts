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
import {BlockHttp, SimpleWallet} from 'nem2-sdk';
import * as readlineSync from 'readline-sync';
import {NetworkTypeResolver} from '../../resolvers/networkType.resolver';
import {PasswordResolver} from '../../resolvers/password.resolver';
import {PrivateKeyResolver} from '../../resolvers/privateKey.resolver';
import {ProfileNameResolver} from '../../resolvers/profile.resolver';
import {URLResolver} from '../../resolvers/url.resolver';
import {ProfileRepository} from '../../respository/profile.repository';
import {ProfileService} from '../../service/profile.service';
import {PasswordValidator} from '../../validators/password.validator';

export class CommandOptions extends Options {
    @option({
        flag: 'n',
        description: 'Network Type. (0: MAIN_NET, 1: TEST_NET, 2: MIJIN, 3: MIJIN_TEST)',
    })
    network: number;

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
        description: '(Optional) Profile password',
        validator: new PasswordValidator(),
    })
    password: string;
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
    async execute(options: CommandOptions) {
        const networkType = new NetworkTypeResolver().resolve(options);
        const url = await new URLResolver().resolve(options);
        const profileName = await new ProfileNameResolver().resolve(options);
        const password = await new PasswordResolver().resolve(options);
        const blockHttp = new BlockHttp(url);

        const simpleWallet: SimpleWallet = SimpleWallet.create(
            profileName,
            password,
            networkType);

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
