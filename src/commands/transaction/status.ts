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
import {TransactionHttp} from 'nem2-sdk';
import {OptionsResolver} from '../../options-resolver';
import {ProfileCommand, ProfileOptions} from '../../profile.command';

export class CommandOptions extends ProfileOptions {
    @option({
        flag: 'h',
        description: 'Transaction hash',
    })
    hash: string;
}

@command({
    description: 'Fetch Transaction info',
})
export default class extends ProfileCommand {

    constructor() {
        super();
    }

    @metadata
    execute(options: CommandOptions) {

        const profile = this.getProfile();

        const transactionHttp = new TransactionHttp(profile.url);
        const hash = OptionsResolver(options,
            'hash',
            () => undefined,
            'Introduce the transaction hash: ');

        this.spinner.start();

        transactionHttp.getTransactionStatus(hash)
            .subscribe((transaction) => {
                let text = '';
                this.spinner.stop(true);
                text += 'group:\t' + transaction.group + '\n';
                text += 'status:\t' + transaction.status + '\n';
                text += 'hash:\t<' + transaction.hash + '>' + '\n';
                if (transaction.deadline) {
                    text += 'deadline:\t' + transaction.deadline.value + '\n';
                }
                if (transaction.height && transaction.height.compact() > 0 ) {
                    text += 'height:\t' + transaction.height.compact() + '\n';
                }
                console.log(text);
            }, (err) => {
                this.spinner.stop(true);
                let text = '';
                text += chalk.red('Error');
                console.log(text, err.response !== undefined ? err.response.text : err);
            });
    }
}
