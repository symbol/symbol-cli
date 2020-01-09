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
import {PublicAccount} from 'nem2-sdk';
import {ProfileOptions} from '../../profile.command';
import {NetworkTypeResolver} from '../../resolvers/networkType.resolver';
import {PublicKeyResolver} from '../../resolvers/publicKey.resolver';
import {NetworkValidator} from '../../validators/network.validator';
import {PublicKeyValidator} from '../../validators/publicKey.validator';

export class CommandOptions extends ProfileOptions {
    @option({
        flag: 'p',
        description: 'Public Key.',
        validator: new PublicKeyValidator(),
    })
    privateKey: string;

    @option({
        flag: 'n',
        description: 'Network Type. (MAIN_NET, TEST_NET, MIJIN, MIJIN_TEST)',
        validator: new NetworkValidator(),
    })
    network: string;

}

@command({
    description: 'Public key -> Address coder.',
})
export default class extends Command {

    constructor() {
        super();
    }

    @metadata
    execute(options: CommandOptions) {
        const publicKey = new PublicKeyResolver().resolve(options);
        const network = new NetworkTypeResolver().resolve(options);
        console.log(PublicAccount.createFromPublicKey(publicKey, network).publicKey);
    }
}
