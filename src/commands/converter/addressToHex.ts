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
        flag: 'a',
        description: 'Address address',
    })
    address: string;

    validateAddress(value: string) {
        if (RawAddress.constants.sizes.addressEncoded !== value.length) {
            throw new ExpectedError(`${value} does not represent a valid base32 address`);
        }
        return value;
    }
}

@command({
    description: 'Converts a base32 address to a hex address',
})

export default class extends ProfileCommand {

    constructor() {
        super();
    }

    @metadata
    execute(options: CommandOptions) {
        let address: string;
        address =  OptionsResolver(options,
            'address',
            () => undefined,
            'Introduce the base32 address: ');
        if (address) {
            address = options.validateAddress(address);
        }

        this.spinner.start();
        let hexAddress: string;
        try {
            hexAddress = Convert.uint8ToHex(RawAddress.stringToAddress(address));
            this.spinner.stop(true);
            console.log(hexAddress);
        } catch (e) {
            this.spinner.stop(true);
            let text = '';
            text += chalk.red('Error');
            console.log(text, 'The conversion failed and a valid base32 address may have been entered');
        }
    }
}
