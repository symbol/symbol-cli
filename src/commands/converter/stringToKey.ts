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
import {Command, command, metadata, option} from 'clime';
import {KeyGenerator} from 'nem2-sdk';
import {ProfileOptions} from '../../profile.command';
import {StringResolver} from '../../resolvers/string.resolver';

export class CommandOptions extends ProfileOptions {
    @option({
        flag: 'v',
        description: 'String value.',
    })
    value: string;
}

@command({
    description: 'String -> UInt64 converter.',
})
export default class extends Command {

    constructor() {
        super();
    }

    @metadata
    execute(options: CommandOptions) {
        const value = new StringResolver().resolve(options);
        console.log(KeyGenerator.generateUInt64Key(value).toString());
    }
}
