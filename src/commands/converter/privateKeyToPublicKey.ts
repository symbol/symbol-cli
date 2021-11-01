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
import { Command, command, metadata, option } from 'clime';
import { Account } from 'symbol-sdk';
import { ProfileOptions } from '../../interfaces/profile.options';
import { NetworkResolver } from '../../resolvers/network.resolver';
import { PrivateKeyResolver } from '../../resolvers/privateKey.resolver';

export class CommandOptions extends ProfileOptions {
    @option({
        flag: 'p',
        description: 'Private Key.',
    })
    privateKey: string;

    @option({
        flag: 'n',
        description: 'Network Type. (MAIN_NET, TEST_NET)',
    })
    network: string;
}

@command({
    description: 'Private key -> Public key converter.',
})
export default class extends Command {
    constructor() {
        super();
    }

    @metadata
    async execute(options: CommandOptions) {
        const privateKey = await new PrivateKeyResolver().resolve(options);
        const network = await new NetworkResolver().resolve(options);
        console.log(Account.createFromPrivateKey(privateKey, network).publicKey);
    }
}
