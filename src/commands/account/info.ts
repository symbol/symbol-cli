/*
 *
 * Copyright 2018 NEM
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
import {command, ExpectedError, metadata, option} from 'clime';
import {AccountHttp, AccountInfo, Address, MosaicAmountView, MosaicHttp, MosaicService,} from 'nem2-sdk';
import {map, mergeMap, toArray} from 'rxjs/operators';
import {AddressValidator} from '../../address.validator';
import {OptionsResolver} from '../../options-resolver';
import {ProfileCommand, ProfileOptions} from '../../profile.command';

export class CommandOptions extends ProfileOptions {
    @option({
        flag: 'a',
        description: 'Account address',
        validator: new AddressValidator(),
    })
    address: string;
}

@command({
    description: 'Fetch account info',
})
export default class extends ProfileCommand {

    constructor() {
        super();
    }

    @metadata
    execute(options: CommandOptions) {
        this.spinner.start();

        const profile = this.getProfile(options);

        let address: Address;
        try {
            address = Address.createFromRawAddress(
                OptionsResolver(options,
                                'address',
                                () => this.getProfile(options).account.address.plain(),
                                'Introduce the address: '));
        } catch (err) {
            console.log(options);
            throw new ExpectedError('Introduce a valid address');
        }

        const accountHttp = new AccountHttp(profile.url);
        const mosaicService = new MosaicService(
            accountHttp,
            new MosaicHttp(profile.url),
        );
        accountHttp.getAccountInfo(address)
            .pipe(
                mergeMap((accountInfo: AccountInfo) => mosaicService.mosaicsAmountViewFromAddress(address)
                    .pipe(
                        mergeMap((_) => _),
                        toArray(),
                        map((mosaics: MosaicAmountView[]) => {
                            return {mosaics, info: accountInfo};
                        }))),
            )
            .subscribe((accountData: any) => {
                const accountInfo = accountData.info;
                this.spinner.stop(true);
                let text = '';
                text += chalk.green('Account:\t') + chalk.bold(address.pretty()) + '\n';
                text += '-'.repeat('Account:\t'.length + address.pretty().length) + '\n\n';
                text += 'Address:\t' + accountInfo.address.pretty() + '\n';
                text += 'at height:\t' + accountInfo.addressHeight.compact() + '\n\n';
                text += 'PublicKey:\t' + accountInfo.publicKey + '\n';
                text += 'at height:\t' + accountInfo.publicKeyHeight.compact() + '\n\n';
                text += 'Importance:\t' + accountInfo.importance.compact() + '\n';
                text += 'at height:\t' + accountInfo.importanceHeight.compact() + '\n\n';
                text += 'Mosaics' + '\n';
                accountData.mosaics.map((mosaic: MosaicAmountView) => {
                    text += mosaic.fullName() + ':\t' + mosaic.relativeAmount() + '\n';
                });
                console.log(text);
            }, (err) => {
                this.spinner.stop(true);
                let text = '';
                text += chalk.red('Error');
                console.log(text, err.response !== undefined ? err.response.text : err);
            });
    }
}
