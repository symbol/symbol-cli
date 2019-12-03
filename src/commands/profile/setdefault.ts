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
import {command, metadata} from 'clime';
import {OptionsResolver} from '../../options-resolver';
import {ProfileOptions, WalletCommand} from '../../profile.command';

export class CommandOptions extends ProfileOptions {

}

@command({
    description: 'Change the default wallet',
})
export default class extends WalletCommand {
    constructor() {
        super();
    }

    @metadata
    execute(options: CommandOptions) {
        options.wallet = OptionsResolver(options,
            'wallet',
            () => undefined,
            'New default wallet: ');
        if (options.wallet) {
            this.setDefaultWallet(options);
            console.log(chalk.green('\nDefault wallet changed to [' + options.wallet + ']'));
        }
    }
}
