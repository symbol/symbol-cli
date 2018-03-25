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
import {command, metadata} from 'clime';
import {Address, Listener} from 'nem2-sdk';
import {MonitorAddressCommand, MonitorAddressOptions} from '../../monitor.transaction.command';
import {OptionsResolver} from '../../options-resolver';

@command({
    description: 'Monitor aggregate bonded transactions added',
})
export default class extends MonitorAddressCommand {

    constructor() {
        super();
    }

    @metadata
    execute(options: MonitorAddressOptions) {
        const profile = this.getProfile(options);

        const address = Address.createFromRawAddress(
            OptionsResolver(options,
                            'address',
                            () => this.getProfile(options).account.address.plain(),
                            'Introduce the address: '));

        const listener = new Listener(profile.url);

        console.log(chalk.green('Monitoring ') + `${address.pretty()} using ${profile.url}`);

        listener.open().then(() => {
            listener.aggregateBondedAdded(address).subscribe((transaction) => {
                console.log('\n' + this.transactionService.formatTransactionToFilter(transaction));
            }, (err) => {
                this.spinner.stop(true);
                let text = '';
                text += chalk.red('Error');
                console.log(text, err.response !== undefined ? err.response.text : err);
            });
        }, (err) => {
            let text = '';
            text += chalk.red('Error');
            console.log(text, err.response !== undefined ? err.response.text : err);
        });
    }
}
