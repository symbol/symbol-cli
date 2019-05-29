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
import {AccountLinkTransaction, Deadline, TransactionHttp} from 'nem2-sdk';
import {ProfileCommand, ProfileOptions} from '../../profile.command';

export class CommandOptions extends ProfileOptions {
    @option({
        flag: 'p',
        description: '<remoteaccountkey>',
    })
    publickey: string;
    @option({
        flag: 'a',
        description: '< 0 (add)| 1 (delete)>',
    })
    action: number;

    validateAction(value: number): 0|1 {
        if (value === 0) {
            return 0;
        } else if (value === 1) {
            return 1;
        } else {
            throw new ExpectedError('Introduce a valid action value');
        }
    }
}

@command({
    description: 'Create a link account transaction ',
})
export default class extends ProfileCommand {

    constructor() {
        super();
    }

    @metadata
    execute(options: CommandOptions) {
        const profile = this.getProfile(options);
        options.validateAction(options.action);
        const accountLinkTransaction = AccountLinkTransaction.create(Deadline.create(), options.publickey, options.action, profile.networkType);
        const signedTransaction = profile.account.sign(accountLinkTransaction);
        const transactionHttp = new TransactionHttp(profile.url);
        transactionHttp.announce(signedTransaction).subscribe(() => {
            console.log(chalk.green('Transaction announced correctly'));
            console.log('Hash:   ', signedTransaction.hash);
            console.log('Signer: ', signedTransaction.signer);
        }, (err) => {
            this.spinner.stop(true);
            let text = '';
            text += chalk.red('Error');
            console.log(text, err.response !== undefined ? err.response.text : err);
        });
    }
}
