/*
 *
 * Copyright 2019 NEM
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
import {EncodeAddressValidator} from '../../address.validator';
import {OptionsResolver} from '../../options-resolver';
import {ProfileCommand, ProfileOptions} from '../../profile.command';

export class CommandOptions extends ProfileOptions {
    @option({
        flag: 'e',
        description: 'Encoded address',
        validator: new EncodeAddressValidator(),
    })
    encodeAddress: string;
}

@command({
    description: 'Converts a encoded address to a decoded address',
})

export default class extends ProfileCommand {

    constructor() {
        super();
    }

    @metadata
    execute(options: CommandOptions) {
        let encodeAddress: string;
        encodeAddress =  OptionsResolver(options,
            'encodeAddress',
            () => undefined,
            'Introduce the encoded address: ');

        this.spinner.start();
        let decodeAddress: string;
        try {
            decodeAddress = Convert.uint8ToHex(RawAddress.stringToAddress(encodeAddress));
            this.spinner.stop(true);
            console.log(decodeAddress);
        } catch (e) {
            this.spinner.stop(true);
            let text = '';
            text += chalk.red('Error');
            console.log(text, 'The conversion failed and a valid encoded address may have been entered');
        }
    }
}
