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
import {ProfileOptions} from '../../interfaces/profile.options'
import {AddressResolver} from '../../resolvers/address.resolver'
import {Command, command, metadata, option} from 'clime'
import {Convert, RawAddress} from 'symbol-sdk'

export class CommandOptions extends ProfileOptions {
    @option({
        flag: 'a',
        description: 'Address.',
    })
    address: string
}

@command({
    description: 'Address Base 32 -> Address hex converter.',
})
export default class extends Command {
    constructor() {
        super()
    }

    @metadata
    async execute(options: CommandOptions) {
        const address = await new AddressResolver().resolve(options)
        console.log(Convert.uint8ToHex(RawAddress.stringToAddress(address.plain())))
    }
}
