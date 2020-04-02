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
import {
    AccountHttp,
    AccountInfo,
    MosaicAmountView,
    MosaicHttp,
    MosaicService,
    MultisigAccountInfo,
    MultisigHttp,
    PublicAccount,
} from 'symbol-sdk'
import {forkJoin, of} from 'rxjs'
import {catchError, mergeMap, toArray} from 'rxjs/operators'

export class CommandOptions extends ProfileOptions {
    @option({
        flag: 'a',
        description: 'Account address.',
    })
    address: string
}

export class AccountInfoTable {
    private readonly table: HorizontalTable
    constructor(public readonly accountInfo: AccountInfo) {
        this.table = new Table({
            style: {head: ['cyan']},
            head: ['Property', 'Value'],
        }) as HorizontalTable
        this.table.push(
            ['Address', accountInfo.address.pretty()],
            ['Address Height', accountInfo.addressHeight.toString()],
            ['Public Key', accountInfo.publicKey],
            ['Public Key Height', accountInfo.publicKeyHeight.toString()],
            ['Importance', accountInfo.importance.toString()],
            ['Importance Height', accountInfo.importanceHeight.toString()],
        )
    }

    toString(): string {
        let text = ''
        text += '\n' + chalk.green('Account Information') + '\n'
        text += this.table.toString()
        return text
    }
}

export class BalanceInfoTable {
    private readonly table: HorizontalTable

    constructor(public readonly mosaicsInfo: MosaicAmountView[]) {
        if (mosaicsInfo.length > 0) {
            this.table = new Table({
                style: {head: ['cyan']},
                head: ['Mosaic Id', 'Relative Amount', 'Absolute Amount', 'Expiration Height'],
            }) as HorizontalTable
            mosaicsInfo.map((mosaic: MosaicAmountView) => {
                this.table.push(
                    [mosaic.fullName(),
                        mosaic.relativeAmount().toLocaleString(),
                        mosaic.amount.toString(),
                        (mosaic.mosaicInfo.duration.compact() === 0 ?
                            'Never' : ((mosaic.mosaicInfo.height.add(mosaic.mosaicInfo.duration).toString()))),
                    ],
                )
            })
        }
    }

    toString(): string {
        let text = ''
        if (this.table) {
            text += '\n' + chalk.green('Balance Information') + '\n'
            text += this.table.toString()
        }
        return text
    }
}

export class MultisigInfoTable {
    private readonly multisigTable: HorizontalTable
    private readonly cosignatoriesTable: HorizontalTable
    private readonly cosignatoryOfTable: HorizontalTable

    constructor(public readonly multisigAccountInfo: MultisigAccountInfo | null) {
        if (multisigAccountInfo && multisigAccountInfo.cosignatories.length > 0) {
            this.multisigTable = new Table({
                style: {head: ['cyan']},
                head: ['Property', 'Value'],
            }) as HorizontalTable
            this.multisigTable.push(
                ['Min Approval', multisigAccountInfo.minApproval.toString()],
                ['Min Removal', multisigAccountInfo.minRemoval.toString()],
            )
            this.cosignatoriesTable = new Table({
                style: {head: ['cyan']},
                head: ['Public Key', 'Address'],
            }) as HorizontalTable
            multisigAccountInfo.cosignatories.map((publicAccount: PublicAccount) => {
                this.cosignatoriesTable.push(
                    [publicAccount.publicKey, publicAccount.address.pretty()],
                )
            })
        }
        if (multisigAccountInfo && multisigAccountInfo.multisigAccounts.length > 0) {
            this.cosignatoryOfTable = new Table({
                style: {head: ['cyan']},
                head: ['Public Key', 'Address'],
            }) as HorizontalTable

            multisigAccountInfo.multisigAccounts.map((publicAccount: PublicAccount) => {
                this.cosignatoryOfTable.push(
                    [publicAccount.publicKey, publicAccount.address.pretty()],
                )
            })
        }
    }

    toString(): string {
        let text = ''
        if (this.multisigTable) {
            text += chalk.green('\n' + 'Multisig Account Information') + '\n'
            text += this.multisigTable.toString()
            text += chalk.green('\n' + 'Cosignatories') + '\n'
            text += this.cosignatoriesTable.toString()
        }
        if (this.cosignatoryOfTable) {
            text += chalk.green('\n' + 'Is cosignatory of') + '\n'
            text += this.cosignatoryOfTable.toString()
        }
        return text
    }
}

@command({
    description: 'Get account information',
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
        const accountHttp = new AccountHttp(profile.url)
        const multisigHttp = new MultisigHttp(profile.url)
        const mosaicHttp = new MosaicHttp(profile.url)
        const mosaicService = new MosaicService(accountHttp, mosaicHttp)

        forkJoin(
            accountHttp.getAccountInfo(address),
            mosaicService.mosaicsAmountViewFromAddress(address).pipe(mergeMap((_) => _), toArray()),
            multisigHttp.getMultisigAccountInfo(address).pipe(catchError((ignored) => of(null))))
            .subscribe((res) => {
                const accountInfo = res[0]
                const mosaicsInfo = res[1]
                const multisigInfo = res[2]
                console.log(
                    new AccountInfoTable(accountInfo).toString(),
                    new BalanceInfoTable(mosaicsInfo).toString(),
                    new MultisigInfoTable(multisigInfo).toString())
                this.spinner.stop(true)
            }, (err) => {
                this.spinner.stop(true)
                console.log(HttpErrorHandler.handleError(err))
                if (err instanceof Object &&
                    'message' in err &&
                    JSON.parse(err.message).statusCode === 404) {
                    console.log(chalk.blue('Info'), 'The account has to receive at least ' +
                        'one transaction to be recorded on the network.')
                }
            })
        }
}
