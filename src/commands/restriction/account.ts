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
import {ProfileCommand} from '../../interfaces/profile.command'
import {ProfileOptions} from '../../interfaces/profile.options'
import {AddressResolver} from '../../resolvers/address.resolver'
import {HttpErrorHandler} from '../../services/httpErrorHandler.service'
import chalk from 'chalk'
import * as Table from 'cli-table3'
import {HorizontalTable} from 'cli-table3'
import {command, metadata, option} from 'clime'
import {AccountRestriction, AccountRestrictionFlags, RestrictionAccountHttp} from 'symbol-sdk'

export class CommandOptions extends ProfileOptions {
    @option({
        flag: 'a',
        description: 'Account address.',
    })
    address: string
}

export class AccountRestrictionsTable {
    private readonly table: HorizontalTable

    constructor(public readonly accountRestrictions: AccountRestriction[]) {
        this.table = new Table({
            style: { head: ['cyan'] },
            head: ['Flags', 'Value'],
        }) as HorizontalTable

        accountRestrictions
            .filter((accountRestriction) => accountRestriction.values.length > 0)
            .map((accountRestriction) => {
                this.table.push(
                    [AccountRestrictionFlags[accountRestriction.restrictionFlags], accountRestriction.values.toString()],
                )
            })
    }

    toString(): string {
        let text = ''
        text += '\n' + chalk.green('Account Restrictions') + '\n'
        text += this.table.toString()
        return text
    }
}

@command({
    description: 'Fetch account restrictions assigned to an address',
})
export default class extends ProfileCommand {

    constructor() {
        super()
    }

    @metadata
    async execute(options: CommandOptions) {
        const profile = this.getProfile(options)
        const address = await new AddressResolver().resolve(options, profile)

        this.spinner.start()
        const restrictionHttp = new RestrictionAccountHttp(profile.url)
        restrictionHttp.getAccountRestrictions(address)
            .subscribe((accountRestrictions: any) => {
                this.spinner.stop(true)
                if (accountRestrictions.length > 0) {
                    console.log(new AccountRestrictionsTable(accountRestrictions).toString())
                } else {
                    console.log('\n The address does not have account restrictions assigned.')
                }
            }, (err: any) => {
                this.spinner.stop(true)
                console.log(HttpErrorHandler.handleError(err))
            })
    }
}
