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
import {command, ExpectedError, metadata, option} from 'clime';
import {Convert, RawAddress} from 'nem2-sdk';
import {OptionsResolver} from '../../options-resolver';
import {ProfileCommand, ProfileOptions} from '../../profile.command';

export class CommandOptions extends ProfileOptions {
    @option({
        flag: 'h',
        description: 'hex address',
    })
    hexAddress: string;
}

@command({
    description: 'Converts a hex address to a base32 address',
})

export default class extends ProfileCommand {

    constructor() {
        super();
    }

    @metadata
    execute(options: CommandOptions) {
        let hexAddress: string;
        hexAddress =  OptionsResolver(options,
            'hexAddress',
            () => undefined,
            'Introduce the hex address: ');

        this.spinner.start();
        let address: string;
        try {
            address = RawAddress.addressToString(Convert.hexToUint8(hexAddress));
            this.spinner.stop(true);
            console.log(address);
        } catch (e) {
            this.spinner.stop(true);
            let text = '';
            text += chalk.red('Error');
            console.log(text, 'Conversion failed, please enter a valid hex address');
        }
    }
}
