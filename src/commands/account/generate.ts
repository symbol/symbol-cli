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
import * as Table from 'cli-table3';
import {HorizontalTable} from 'cli-table3';
import {Command, command, ExpectedError, metadata, option, Options} from 'clime';
import {Account, BlockHttp, NetworkHttp, NetworkType} from 'nem2-sdk';
import * as readlineSync from 'readline-sync';
import {OptionsResolver} from '../../options-resolver';
import {ProfileRepository} from '../../respository/profile.repository';
import {ProfileService} from '../../service/profile.service';
import {NetworkValidator} from '../../validators/network.validator';

export class CommandOptions extends Options {
    @option({
        flag: 's',
        description: '(Optional) Saves the profile',
        toggle: true,
    })
    save: any;

    @option({
        flag: 'u',
        description: '(Optional) When saving profile, provide a NEM2 Node URL. Example: http://localhost:3000',
    })
    url: string;

    @option({
        description: '(Optional) Profile name.',
    })
    profile: string;

    @option({
        flag: 'n',
        description: 'Network Type (MAIN_NET, TEST_NET, MIJIN, MIJIN_TEST).',
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
        throw new ExpectedError('Introduce a valid network type. Example: MIJIN_TEST');
    }
}

export class AccountCredentialsTable {
    private readonly table: HorizontalTable;

    constructor(public readonly account: Account) {
        this.table = new Table({
            style: { head: ['cyan'] },
            head: ['Property', 'Value'],
        }) as HorizontalTable;
        this.table.push(
            ['Address', account.address.pretty()],
            ['Public Key', account.publicKey],
            ['Private Key', account.privateKey],
        );
    }

    toString(): string {
        let text = '';
        text += '\n\n' + chalk.green('New Account') + '\n';
        text += this.table.toString();
        return text;
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
            'Introduce the network type (MIJIN_TEST, MIJIN, MAIN_NET, TEST_NET): '));

        const account = Account.generateNewAccount(networkType);
        let text = new AccountCredentialsTable(account).toString();

        if (!options.save && readlineSync.keyInYN('Do you want to save the account?')) {
            options.save = true;
        }

        if (options.save) {
            const url = OptionsResolver(options,
                'url',
                () => undefined,
                'Introduce the NEM2 node URL. (Example: http://localhost:3000): ').trim();

            let profile: string;
            if (options.profile) {
                profile = options.profile;
            } else {
                profile = readlineSync.question('Insert the profile name: ');
            }
            profile.trim();

            const networkHttp = new NetworkHttp(url);
            const blockHttp = new BlockHttp(url);

            blockHttp.getBlockByHeight('1')
                .subscribe((block) => {
                    if (block.networkType !== networkType) {
                        console.log('The network provided and node network don\'t match.');
                    } else {
                        this.profileService.createNewProfile(account,
                            url as string,
                            profile,
                            block.generationHash);
                        if (readlineSync.keyInYN('Do you want to set the account as the default profile?')) {
                            this.profileService.setDefaultProfile(profile);
                        }
                        text += chalk.green('\nStored ' + profile + ' profile');
                        console.log(text);
                    }
                }, (ignored) => {
                    let error = '';
                    error += chalk.red('Error');
                    error += ' Check if you can reach the NEM2 url provided: ' + url + '/block/1';
                    console.log(error);
                });
        } else {
            console.log(text);
        }
    }
}
