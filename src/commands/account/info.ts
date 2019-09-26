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
import {command, metadata, option} from 'clime';
import {AccountHttp, Address, MosaicHttp, MosaicService} from 'nem2-sdk';
import {forkJoin, of} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {OptionsResolver} from '../../options-resolver';
import {ProfileCommand, ProfileOptions} from '../../profile.command';
import {AccountCLIService} from '../../service/account.service';
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
    private readonly accountCLIService: AccountCLIService;

    constructor() {
        super();
        this.accountCLIService = new AccountCLIService();
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
                    this.accountCLIService.formatAccountInfo(accountInfo),
                    this.accountCLIService.formatMosaicsInfo(mosaicsInfo),
                    this.accountCLIService.formatMultisigInfo(multisigInfo));
                this.spinner.stop(true);
            }, (err) => {
                this.spinner.stop(true);
                let text = '';
                text += chalk.red('Error');
                console.log(text, err.response !== undefined ? err.response.text : err);
            });
    }

}
