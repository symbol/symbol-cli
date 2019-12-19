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
import * as Table from 'cli-table3';
import { HorizontalTable } from 'cli-table3';
import { command, ExpectedError, metadata, option } from 'clime';
import { AccountRestriction, AccountRestrictionFlags, Address, Password, RestrictionAccountHttp } from 'nem2-sdk';
import * as readlineSync from 'readline-sync';
import { OptionsResolver } from '../../options-resolver';
import { ProfileCommand, ProfileOptions } from '../../profile.command';
import { AddressValidator } from '../../validators/address.validator';
import {PasswordValidator} from '../../validators/password.validator';

export class CommandOptions extends ProfileOptions {
    @option({
        flag: 'a',
        description: 'Account address.',
        validator: new AddressValidator(),
    })
    address: string;

    @option({
        flag: 'p',
        description: '(Optional) Account password',
        validator: new PasswordValidator(),
    })
    password: string;
}

export class AccountRestrictionsTable {
    private readonly table: HorizontalTable;

    constructor(public readonly accountRestrictions: AccountRestriction[]) {
        this.table = new Table({
            style: { head: ['cyan'] },
            head: ['Flags', 'Value'],
        }) as HorizontalTable;

        accountRestrictions
            .filter((accountRestriction) => accountRestriction.values.length > 0)
            .map((accountRestriction) => {
                this.table.push(
                    [AccountRestrictionFlags[accountRestriction.restrictionFlags], accountRestriction.values.toString()],
                );
            });
    }

    toString(): string {
        let text = '';
        text += '\n\n' + chalk.green('Account Restrictions') + '\n';
        text += this.table.toString();
        return text;
    }
}

@command({
    description: 'Fetch account restrictions assigned to an address',
})
export default class extends ProfileCommand {

    constructor() {
        super();
    }

    @metadata
    execute(options: CommandOptions) {
        this.spinner.start();
        const profile = this.getProfile(options);

        const password = options.password || readlineSync.question('Enter your wallet password: ');
        new PasswordValidator().validate(password);
        const passwordObject = new Password(password);

        if (!profile.isPasswordValid(passwordObject)) {
            throw new ExpectedError('The password you provided does not match your account password');
        }

        const account = profile.simpleWallet.open(passwordObject);

        options.address = OptionsResolver(options,
            'address',
            () => account.address.plain(),
            'Introduce an address: ');
        const address = Address.createFromRawAddress(options.address);

        const restrictionHttp = new RestrictionAccountHttp(profile.url);
        restrictionHttp.getAccountRestrictions(address)
            .subscribe((accountRestrictions: any) => {
                this.spinner.stop(true);
                if (accountRestrictions.length > 0) {
                    console.log(new AccountRestrictionsTable(accountRestrictions).toString());
                } else {
                    console.log('\n The address does not have account restrictions assigned.');
                }
            }, (err: any) => {
                this.spinner.stop(true);
                let text = '';
                text += chalk.red('Error');
                console.log(text, err.response !== undefined ? err.response.text : err);
            });
    }
}
