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
import {ProfileOptions} from '../../profile.command';
import {AmountResolver} from '../../resolvers/amount.resolver';
import {NumericStringValidator} from '../../validators/numericString.validator';

export class CommandOptions extends ProfileOptions {
    @option({
        flag: 'a',
        description: 'Numeric string. Example: 12345678',
        validator: new NumericStringValidator(),
    })
    amount: string;
}

@command({
    description: 'Numeric string -> UInt64 coder.',
})
export default class extends Command {

    constructor() {
        super();
    }

    @metadata
    execute(options: CommandOptions) {
        const value = new AmountResolver().resolve(options);
        console.log(value.toHex());
    }
}
