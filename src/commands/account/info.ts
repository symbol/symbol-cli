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
import {AccountHttp, AccountInfo, Address, MosaicAmountView, MosaicHttp, MosaicService, MultisigAccountInfo, PublicAccount} from 'nem2-sdk';
import {forkJoin, of} from 'rxjs';
import {catchError, mergeMap, toArray} from 'rxjs/operators';
import {OptionsResolver} from '../../options-resolver';
import {ProfileCommand, ProfileOptions} from '../../profile.command';
import {AddressValidator} from '../../validators/address.validator';

export class CommandOptions extends ProfileOptions {
    @option({
        flag: 'a',
        description: 'Account address',
        validator: new AddressValidator(),
    })
    address: string;
}

export class AccountInfoTable {
    private readonly table: HorizontalTable;
    constructor(public readonly accountInfo: AccountInfo) {
        this.table = new Table({
            style: {head: ['cyan']},
            head: ['Property', 'Value'],
        }) as HorizontalTable;
        this.table.push(
            ['Address', accountInfo.address.pretty()],
            ['Address Height', accountInfo.addressHeight.compact().toString()],
            ['Public Key', accountInfo.publicKey],
            ['Public Key Height', accountInfo.publicKeyHeight.compact()],
            ['Importance', accountInfo.importance.compact()],
            ['Importance Height', accountInfo.importanceHeight.compact()],
        );
    }

    toString(): string {
        let text = '';
        text += '\n\n' + chalk.green('Account Information') + '\n';
        text += this.table.toString();
        return text;
    }
}

export class BalanceInfoTable {
    private readonly table: HorizontalTable;

    constructor(public readonly mosaicsInfo: MosaicAmountView[]) {
        if (mosaicsInfo.length > 0) {
            this.table = new Table({
                style: {head: ['cyan']},
                head: ['Mosaic Id', 'Relative Amount', 'Absolute Amount', 'Expiration Height'],
            }) as HorizontalTable;
            mosaicsInfo.map((mosaic: MosaicAmountView) => {
                this.table.push(
                    [mosaic.fullName(),
                        mosaic.relativeAmount().toLocaleString(),
                        mosaic.amount.compact().toString(),
                        (mosaic.mosaicInfo.duration.compact() === 0 ?
                            'Never' : ((mosaic.mosaicInfo.height.compact() + mosaic.mosaicInfo.duration.compact()).toString())),
                    ],
                );
            });
        }
    }

    toString(): string {
        let text = '';
        if (this.table) {
            text += '\n\n' + chalk.green('Balance Information') + '\n';
            text += this.table.toString();
        }
        return text;
    }
}

export class MultisigInfoTable {
    private readonly multisigTable: HorizontalTable;
    private readonly cosignatoriesTable: HorizontalTable;
    private readonly cosignatoryOfTable: HorizontalTable;

    constructor(public readonly multisigAccountInfo: MultisigAccountInfo | null) {
        if (multisigAccountInfo && multisigAccountInfo.cosignatories.length > 0) {
            this.multisigTable = new Table({
                style: {head: ['cyan']},
                head: ['Property', 'Value'],
            }) as HorizontalTable;
            this.multisigTable.push(
                ['Min Approval', multisigAccountInfo.minApproval.toString()],
                ['Min Removal', multisigAccountInfo.minRemoval.toString()],
            );
            this.cosignatoriesTable = new Table({
                style: {head: ['cyan']},
                head: ['Public Key', 'Address'],
            }) as HorizontalTable;
            multisigAccountInfo.cosignatories.map((publicAccount: PublicAccount) => {
                this.cosignatoriesTable.push(
                    ['Public Key', publicAccount.publicKey],
                    ['Address', publicAccount.address.pretty()],
                );
            });
        }
        if (multisigAccountInfo && multisigAccountInfo.multisigAccounts.length > 0) {
            this.cosignatoryOfTable = new Table({
                style: {head: ['cyan']},
                head: ['Public Key', 'Address'],
            }) as HorizontalTable;

            multisigAccountInfo.multisigAccounts.map((publicAccount: PublicAccount) => {
                this.cosignatoryOfTable.push(
                    ['Public Key', publicAccount.publicKey],
                    ['Address', publicAccount.address.pretty()],
                );
            });
        }
    }

    toString(): string {
        let text = '';
        if (this.multisigTable) {
            text += chalk.green('\n\n' + 'Multisig Account Information') + '\n';
            text += this.multisigTable.toString();
            text += chalk.green('\n\n' + 'Cosignatories') + '\n';
            text += this.cosignatoriesTable.toString();
        }
        if (this.cosignatoryOfTable) {
            text += chalk.green('\n\n' + 'Is cosignatory of') + '\n';
            text += this.cosignatoryOfTable.toString();
        }
        return text;
    }
}

@command({
    description: 'Get account information',
})
export default class extends ProfileCommand {

    constructor() {
        super();
    }

    @metadata
    execute(options: CommandOptions) {
        this.spinner.start();

        const profile = this.getProfile(options);

        const address: Address = Address.createFromRawAddress(
            OptionsResolver(options,
                'address',
                () => this.getProfile(options).account.address.plain(),
                'Introduce an address: '));

        const accountHttp = new AccountHttp(profile.url);
        const mosaicHttp = new MosaicHttp(profile.url);
        const mosaicService = new MosaicService(accountHttp, mosaicHttp);

        forkJoin(
            accountHttp.getAccountInfo(address),
            mosaicService.mosaicsAmountViewFromAddress(address).pipe(mergeMap((_) => _), toArray()),
            accountHttp.getMultisigAccountInfo(address).pipe(catchError((ignored) => of(null))))
            .subscribe((res) => {
                const accountInfo = res[0];
                const mosaicsInfo = res[1];
                const multisigInfo = res[2];
                console.log(
                    new AccountInfoTable(accountInfo).toString(),
                    new BalanceInfoTable(mosaicsInfo).toString(),
                    new MultisigInfoTable(multisigInfo).toString());
                this.spinner.stop(true);
            }, (err) => {
                this.spinner.stop(true);
                let text = '';
                text += chalk.red('Error');
                console.log(text, err.response !== undefined ? err.response.text : err);
            });
    }
}
