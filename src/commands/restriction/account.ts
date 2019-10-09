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
import {HorizontalTable} from 'cli-table3';
import {command, metadata, option} from 'clime';
import {AccountRestriction, AccountRestrictionType, Address, RestrictionHttp} from 'nem2-sdk';
import {AnnounceTransactionsCommand, AnnounceTransactionsOptions} from '../../announce.transactions.command';
import {OptionsResolver} from '../../options-resolver';
import {AddressValidator} from '../../validators/address.validator';

export class CommandOptions extends AnnounceTransactionsOptions {
    @option({
        flag: 'a',
        description: 'Account address.',
        validator: new AddressValidator(),
    })
    address: string;
}

export class AccountRestrictionsTable {
    private readonly table: HorizontalTable;

    constructor(public readonly accountRestrictions: AccountRestriction[]) {
        this.table = new Table({
            style: {head: ['cyan']},
            head: ['Type', 'Value'],
        }) as HorizontalTable;
        accountRestrictions
            .filter((accountRestriction) => accountRestriction.values.length > 0)
            .map((accountRestriction) => {
                this.table.push(
                    [AccountRestrictionType[accountRestriction.restrictionType], accountRestriction.values.toString()],
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
export default class extends AnnounceTransactionsCommand {

    constructor() {
        super();
    }

    @metadata
    execute(options: CommandOptions) {
        this.spinner.start();
        const profile = this.getProfile();
        const address: Address = Address.createFromRawAddress(
            OptionsResolver(options,
                'address',
                () => profile.account.address.plain(),
                'Introduce an address: '));

        const restrictionHttp = new RestrictionHttp(profile.url);
        restrictionHttp.getAccountRestrictions(address)
            .subscribe((accountRestrictions: any) => {
                this.spinner.stop(true);
                if (accountRestrictions.accountRestrictions.restrictions.length > 0) {
                    console.log(new AccountRestrictionsTable(accountRestrictions.accountRestrictions.restrictions).toString());
                } else {
                    console.log('\n The address does not have any account restriction assigned.');
                }
            }, (err: any) => {
                this.spinner.stop(true);
                let text = '';
                text += chalk.red('Error');
                console.log(text, err.response !== undefined ? err.response.text : err);
            });
    }
}
