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
import {Command, command, ExpectedError, metadata, option, Options} from 'clime';
import {Account, BlockHttp, NetworkType} from 'nem2-sdk';
import * as prompts from 'prompts';
import {PromptsResolver, trimFormatter} from '../../options-resolver';
import {ProfileRepository} from '../../respository/profile.repository';
import {ProfileService} from '../../service/profile.service';
import {NetworkValidator} from '../../validators/network.validator';
import {PrivateKeyValidator} from '../../validators/privateKey.validator';
import {privateKeyChecker, profileNameChecker, urlChecker} from '../../validators/prompts.validator';

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
    description: 'Create a new profile',
})

export default class extends Command {
    private readonly profileService: ProfileService;
    private readonly networkTypePrompts: prompts.PromptObject<string> = {
        type: 'select',
        name: 'networkType',
        message: 'Introduce network type: ',
        choices: [
          { title: 'MAIN_NET', value: 'MAIN_NET' },
          { title: 'TEST_NET', value: 'TEST_NET' },
          { title: 'MIJIN', value: 'MIJIN' },
          { title: 'MIJIN_TEST', value: 'MIJIN_TEST' },
        ],
    };
    private readonly privateKeyPrompts: prompts.PromptObject<string> = {
        type: 'text',
        name: 'privateKey',
        message: 'Introduce your private key: ',
        format: trimFormatter,
        validate: privateKeyChecker,
    };
    private readonly urlPrompts: prompts.PromptObject<string> = {
        type: 'text',
        name: 'url',
        message: 'Introduce NEM 2 Node URL (Example: http://localhost:3000):',
        format: trimFormatter,
        validate: urlChecker,
    };
    private readonly profilePrompts: prompts.PromptObject<string> = {
        type: 'text',
        name: 'profile',
        message: 'Insert profile name: ',
        format: trimFormatter,
        validate: profileNameChecker,
    };
    private readonly isSavePrompts: prompts.PromptObject<string> = {
        type: 'toggle',
        name: 'isSave',
        message: 'Do you want to set the account as the default profile?',
        initial: false,
        active: 'Yes',
        inactive: 'No',
    };
    constructor() {
        super();
        const profileRepository = new ProfileRepository('.nem2rc.json');
        this.profileService = new ProfileService(profileRepository);
    }

    @metadata
    async execute(options: CommandOptions) {
        const networkType = options.getNetwork(await PromptsResolver(this.networkTypePrompts, options, 'network'));

        const account: Account = Account.createFromPrivateKey(
            await PromptsResolver(this.privateKeyPrompts, options, 'privateKey'),
            networkType,
        );

        const url = await PromptsResolver(this.urlPrompts, options, 'url');

        let profileName: string;
        if (options.profile) {
            profileName = options.profile;
        } else {
            profileName = await PromptsResolver(this.profilePrompts, options, 'profile');
        }

        const blockHttp = new BlockHttp(url);

        blockHttp.getBlockByHeight('1')
            .subscribe(async (block) => {
                if (block.networkType !== networkType) {
                    console.log('The network provided and the node network don\'t match.');
                } else {
                    const profile = this.profileService.createNewProfile(account,
                        url as string,
                        profileName,
                        block.generationHash);
                    const isSave: boolean = await PromptsResolver(this.isSavePrompts);
                    if (isSave) {
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
