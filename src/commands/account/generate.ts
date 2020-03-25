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
import chalk from 'chalk'
import {command, metadata, option} from 'clime'
import {Account, SimpleWallet} from 'symbol-sdk'

import {AccountCredentialsTable, CreateProfileCommand, CreateProfileOptions} from '../../interfaces/create.profile.command'
import {DefaultResolver} from '../../resolvers/default.resolver'
import {GenerationHashResolver} from '../../resolvers/generationHash.resolver'
import {NetworkCurrencyResolver} from '../../resolvers/networkCurrency.resolver'
import {NetworkResolver} from '../../resolvers/network.resolver'
import {PasswordResolver} from '../../resolvers/password.resolver'
import {ProfileNameResolver} from '../../resolvers/profile.resolver'
import {SaveResolver} from '../../resolvers/save.resolver'
import {URLResolver} from '../../resolvers/url.resolver'

export class CommandOptions extends CreateProfileOptions {
    @option({
        flag: 's',
        description: '(Optional) Saves the profile.',
        toggle: true,
    })
    save: any
}

@command({
    description: 'Generate new accounts',
})
export default class extends CreateProfileCommand {

    constructor() {
        super()
    }

    @metadata
    async execute(options: CommandOptions) {
        const networkType = await new NetworkResolver().resolve(options)
        const save = await new SaveResolver().resolve(options)
        const account = Account.generateNewAccount(networkType)
        console.log(new AccountCredentialsTable(account).toString())
        if (save) {
            options.url = await new URLResolver().resolve(options)
            const profileName = await new ProfileNameResolver().resolve(options)
            const password = await new PasswordResolver().resolve(options)
            const isDefault = await new DefaultResolver().resolve(options)
            const generationHash = await new GenerationHashResolver().resolve(options)
            const networkCurrency = await new NetworkCurrencyResolver().resolve(options)

            const simpleWallet = SimpleWallet.createFromPrivateKey(
                profileName,
                password,
                account.privateKey,
                networkType)
            this.createProfile(simpleWallet, options.url, isDefault, generationHash, networkCurrency)
            console.log( chalk.green('\nStored ' + profileName + ' profile'))
        }
    }
}
