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
import {command, ExpectedError, metadata, option} from 'clime';
import {ProfileCommand, ProfileOptions} from '../../profile.command';
import {OptionsResolver} from "../../options-resolver";
import {Address} from "nem2-sdk";

export class CommandOptions extends ProfileOptions {
    @option({
        flag: 'd',
        description: ' a hexadecimal address  ',
    })
    address: string;
}
@command({
    description: 'Converts a hexadecimal address to an address',
})
export default class extends ProfileCommand {

    constructor() {
        super();
    }

    @metadata
    execute(options: ProfileOptions) {

        const address  = OptionsResolver(options,
            'address',
            () => undefined,
            'Introduce the  a hexadecimal address : ');
        try {
            const addressRst = Address.createFromRawAddress(address);
            console.log(addressRst);
        } catch (err) {
            throw new ExpectedError('introduce a valid address');
        }
    }
}
