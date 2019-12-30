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
import {Command, command, metadata, option, Options} from 'clime';
import {Account, BlockHttp, Password, SimpleWallet} from 'nem2-sdk';
import * as readlineSync from 'readline-sync';
import {NetworkTypeResolver} from '../../resolvers/networkType.resolver';
import {PasswordResolver} from '../../resolvers/password.resolver';
import {ProfileNameResolver} from '../../resolvers/profile.resolver';
import {URLResolver} from '../../resolvers/url.resolver';
import {ProfileRepository} from '../../respository/profile.repository';
import {ProfileService} from '../../service/profile.service';
import {PasswordValidator} from '../../validators/password.validator';

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
        description: 'Network Type. (0: MAIN_NET, 1: TEST_NET, 2: MIJIN, 3: MIJIN_TEST)',
    })
    network: number;

    @option({
        flag: 'p',
        description: '(Optional) Profile password',
        validator: new PasswordValidator(),
    })
    password: string;
}

export class AccountCredentialsTable {
    private readonly table: HorizontalTable;

    constructor(
        public readonly account: Account,
        public readonly password?: Password,
    ) {

        this.table = new Table({
            style: { head: ['cyan'] },
            head: ['Property', 'Value'],
        }) as HorizontalTable;
        this.table.push(
            ['Address', account.address.pretty()],
            ['Public Key', account.publicKey],
            ['Private Key', account.privateKey],
        );
        if (password) {
            this.table.push(['Password', password.value]);
        }
    }

    toString(): string {
        let text = '';
        text += '\n' + chalk.green('Account') + '\n';
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
        const networkType = new NetworkTypeResolver().resolve(options);
        const profile = new ProfileNameResolver().resolve(options);
        const password = new PasswordResolver().resolve(options);
        const simpleWallet = SimpleWallet.create(profile, password, networkType);
        let text = new AccountCredentialsTable(simpleWallet.open(password), password).toString();

        if (!options.save && readlineSync.keyInYN('Do you want to save the account?')) {
            options.save = true;
        }

        if (options.save) {
            const url = new URLResolver().resolve(options);
            const blockHttp = new BlockHttp(url);

            blockHttp.getBlockByHeight('1')
                .subscribe((block) => {
                    if (block.networkType !== networkType) {
                        console.log('The network provided and node network don\'t match.');
                    } else {
                        this.profileService.createNewProfile(simpleWallet,
                            url as string,
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
