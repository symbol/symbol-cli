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
import {RawUInt64} from 'nem2-sdk';
import {OptionsResolver} from '../../options-resolver';
import {ProfileCommand, ProfileOptions} from '../../profile.command';

export class CommandOptions extends ProfileOptions {
    @option({
        flag: 'h',
        description: 'hexadecimal',
    })
    hex: string;
}

@command({
    description: 'Converts a hexadecimal id to a uint64 id',
})

export default class extends ProfileCommand {

    constructor() {
        super();
    }

    @metadata
    execute(options: CommandOptions) {
        let hex: string;
        hex =  OptionsResolver(options,
            'hex',
            () => undefined,
            'Introduce the hexadecimal: ');

        this.spinner.start();
        let uInt64Array: number[];
        try {
            uInt64Array = RawUInt64.fromHex(hex);
            this.spinner.stop(true);
            console.log(uInt64Array);
        } catch (e) {
            this.spinner.stop(true);
            let text = '';
            text += chalk.red('Error');
            console.log(text, `${hex} is not a valid hexadecimal`);
        }
    }
}
