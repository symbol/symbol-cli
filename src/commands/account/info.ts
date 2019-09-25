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
import {catchError} from 'rxjs/operators';
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
            mosaicService.mosaicsAmountViewFromAddress(address),
            accountHttp.getMultisigAccountInfo(address).pipe(catchError((ignored) => of(null))))
            .subscribe((res) => {
                const accountInfo = res[0];
                const mosaicsInfo = res[1];
                const multisigInfo = res[2];
                console.log(
                    this.formatAccountInfo(accountInfo),
                    this.formatMosaicsInfo(mosaicsInfo),
                    this.formatMultisigInfo(multisigInfo));
                this.spinner.stop(true);
            }, (err) => {
                this.spinner.stop(true);
                let text = '';
                text += chalk.red('Error');
                console.log(text, err.response !== undefined ? err.response.text : err);
            });
    }

    private formatAccountInfo(accountInfo: AccountInfo) {
        const table = new Table({
            style: {head: ['cyan']},
            head: ['Property', 'Value'],
        }) as HorizontalTable;
        let text = '';
        text += '\n\n' + chalk.green('Account Information') + '\n';
        table.push(
            ['Address', accountInfo.address.pretty()],
            ['Address Height', accountInfo.addressHeight.compact().toString()],
            ['PublicKey', accountInfo.publicKey],
            ['PublicKey Height', accountInfo.publicKeyHeight.compact()],
            ['Importance', accountInfo.importance.compact()],
            ['Importance Height', accountInfo.importanceHeight.compact()],
        );
        text += table.toString();
        return text;
    }

    private formatMosaicsInfo(mosaicsInfo: MosaicAmountView[]) {
        const table = new Table({
            style: {head: ['cyan']},
            head: ['Mosaic Id', 'Relative Amount', 'Absolute Amount', 'Expiration Height'],
        }) as HorizontalTable;
        let text = '';
        if (mosaicsInfo.length > 0) {
            text += chalk.green('\n\n' + 'Balance') + '\n';
            mosaicsInfo.map((mosaic: MosaicAmountView) => {
                table.push(
                    [mosaic.fullName(),
                        mosaic.relativeAmount().toLocaleString(),
                        mosaic.amount.compact().toString(),
                        (mosaic.mosaicInfo.duration.compact() === 0 ?
                            'Never' : ((mosaic.mosaicInfo.height.compact() + mosaic.mosaicInfo.duration.compact()).toString())),
                    ],
                );
            });
            text += table.toString();
        }
        return text;
    }

    private formatMultisigInfo(multisigAccountInfo: MultisigAccountInfo | null) {
        let text = '';
        if (multisigAccountInfo && multisigAccountInfo.cosignatories.length > 0) {
            text += chalk.green('\n\n' + 'Multisig Account Information') + '\n';
            const multisigTable = new Table({
                style: {head: ['cyan']},
                head: ['Property', 'Value'],
            }) as HorizontalTable;
            multisigTable.push(
                ['Min Approval', multisigAccountInfo.minApproval.toString()],
                ['Min Removal', multisigAccountInfo.minRemoval.toString()],
            );
            text += multisigTable.toString();
            text += chalk.green('\n\n' + 'Cosignatories') + '\n';
            const cosignatoriesTable = new Table({
                style: {head: ['cyan']},
                head: ['Public Key', 'Address'],
            }) as HorizontalTable;
            multisigAccountInfo.cosignatories.map((publicAccount: PublicAccount) => {
                cosignatoriesTable.push(
                    ['Public Key', publicAccount.publicKey],
                    ['Address', publicAccount.address.pretty()],
                );
            });
            text += cosignatoriesTable.toString();
        }
        if (multisigAccountInfo && multisigAccountInfo.multisigAccounts.length > 0) {
            text += chalk.green('\n\n' + 'Is cosignatory of') + '\n';
            const cosignatoryOfTable = new Table({
                style: {head: ['cyan']},
                head: ['Public Key', 'Address'],
            }) as HorizontalTable;

            multisigAccountInfo.multisigAccounts.map((publicAccount: PublicAccount) => {
                cosignatoryOfTable.push(
                    ['Public Key', publicAccount.publicKey],
                    ['Address', publicAccount.address.pretty()],
                );
            });
            text += cosignatoryOfTable.toString();
        }
        return text;
    }
}
