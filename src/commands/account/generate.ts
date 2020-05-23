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
import chalk from 'chalk';
import { command, metadata, option } from 'clime';
import { MnemonicPassPhrase } from 'symbol-hd-wallets';
import { Account } from 'symbol-sdk';

import { AccountCredentialsTable, CreateProfileCommand } from '../../interfaces/create.profile.command';
import { CreateProfileOptions } from '../../interfaces/createProfile.options';
import { ImportType } from '../../models/importType.enum';
import { Profile } from '../../models/profile.model';
import { ProfileCreationBase } from '../../models/profileCreation.types';
import { DefaultResolver } from '../../resolvers/default.resolver';
import { GenerationHashResolver } from '../../resolvers/generationHash.resolver';
import { ImportTypeResolver } from '../../resolvers/importType.resolver';
import { NetworkResolver } from '../../resolvers/network.resolver';
import { NetworkCurrencyResolver } from '../../resolvers/networkCurrency.resolver';
import { PasswordResolver } from '../../resolvers/password.resolver';
import { PathNumberResolver } from '../../resolvers/pathNumber.resolver';
import { ProfileNameResolver } from '../../resolvers/profile.resolver';
import { SaveResolver } from '../../resolvers/save.resolver';
import { URLResolver } from '../../resolvers/url.resolver';
import { DerivationService } from '../../services/derivation.service';

export class CommandOptions extends CreateProfileOptions {
    @option({
        flag: 's',
        description: '(Optional) Saves the profile.',
        toggle: true,
    })
    save: any;
}

@command({
    description: 'Generate new accounts',
})
export default class extends CreateProfileCommand {
    constructor() {
        super();
    }

    @metadata
    async execute(options: CommandOptions) {
        const networkType = await new NetworkResolver().resolve(options);
        const save = await new SaveResolver().resolve(options);
        const importType = await new ImportTypeResolver().resolve(options);

        if (!save) {
            if (importType === ImportType.PrivateKey) {
                const account = Account.generateNewAccount(networkType);
                console.log(AccountCredentialsTable.createFromAccount(account).toString());
            } else {
                const pathNumber = await new PathNumberResolver().resolve(options);
                const mnemonic = MnemonicPassPhrase.createRandom().plain;
                const privateKey = DerivationService.getPrivateKeyFromMnemonic(mnemonic, pathNumber);
                console.log(
                    AccountCredentialsTable.createFromAccount(
                        Account.createFromPrivateKey(privateKey, networkType),
                        mnemonic,
                        pathNumber,
                    ).toString(),
                );
            }
            return;
        }

        options.url = await new URLResolver().resolve(options);
        const name = await new ProfileNameResolver().resolve(options);
        const password = await new PasswordResolver().resolve(options);
        const isDefault = await new DefaultResolver().resolve(options);

        this.spinner.start();
        const generationHash = await new GenerationHashResolver().resolve(options);
        const networkCurrency = await new NetworkCurrencyResolver().resolve(options);
        this.spinner.stop(true);

        const baseArguments: ProfileCreationBase = {
            generationHash,
            isDefault,
            name,
            networkCurrency,
            networkType,
            password,
            url: options.url,
        };

        let profile: Profile;

        if (importType === ImportType.PrivateKey) {
            const { privateKey } = Account.generateNewAccount(networkType);
            profile = this.createProfile({ ...baseArguments, privateKey });
        } else {
            const mnemonic = MnemonicPassPhrase.createRandom().plain;
            profile = this.createProfile({ ...baseArguments, mnemonic, pathNumber: 1 });
        }

        console.log(AccountCredentialsTable.createFromProfile(profile, password).toString());
        console.log(chalk.green('\nStored ' + name + ' profile'));
    }
}
