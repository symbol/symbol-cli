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
import {UInt64} from 'nem2-sdk';
import {OptionsResolver} from '../../options-resolver';
import {ProfileCommand, ProfileOptions} from '../../profile.command';

export class CommandOptions extends ProfileOptions {
    @option({
        flag: 'u',
        description: 'UInt64 uint64Array',
    })
    uint64ToString: string;

    validateUInt64(uintArray: number[]) {
        if (uintArray.length !== 2 || uintArray[0] < 0 || uintArray[1] < 0) {
            throw new ExpectedError('UInt64 must be an array of two uint numbers');
        }
        return uintArray;
    }
}

@command({
    description: 'Converts a uint64 Array id to a hexadecimal id',
})

export default class extends ProfileCommand {

    constructor() {
        super();
    }

    @metadata
    execute(options: CommandOptions) {
        let uint64: number[];
        // Because getting an array from the command line is converted to a string type, the JSON.parse() method is used.
        uint64 =  JSON.parse(OptionsResolver(options,
            'uint64ToString',
            () => undefined,
            'Introduce the UInt64 Array: '));
        if (uint64) {
            uint64 = options.validateUInt64(uint64);
        }

        this.spinner.start();
        let hex: string;
        try {
            hex = new UInt64(uint64).toHex();
            this.spinner.stop(true);
            console.log(hex);
        } catch (e) {
            this.spinner.stop(true);
            let text = '';
            text += chalk.red('Error');
            console.log(text, 'Not a valid UInt64');
        }
    }
}
