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
import {command, metadata} from 'clime';
import {Listener} from 'nem2-sdk';
import {MonitorAddressCommand, MonitorAddressOptions} from '../../interfaces/monitor.transaction.command';
import {AddressResolver} from '../../resolvers/address.resolver';
import {TransactionView} from '../../views/transactions/details/transaction.view';

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
        const address = new AddressResolver().resolve(options, profile);

        console.log(chalk.green('Monitoring ') + `${address.pretty()} using ${profile.url}`);
        const listener = new Listener(profile.url);
        listener.open().then(() => {
            listener.aggregateBondedAdded(address).subscribe((transaction) => {
                new TransactionView(transaction).print();
            }, (err) => {
                listener.close();
                err = err.message ? JSON.parse(err.message) : err;
                console.log(chalk.red('Error'), err.body && err.body.message ? err.body.message : err);
            });
        }, (err) => {
            listener.close();
            console.log(chalk.red('Error'), err);
        });
    }
}
