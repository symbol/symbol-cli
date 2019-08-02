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
import {AccountLinkTransaction, Deadline, TransactionHttp, UInt64} from 'nem2-sdk';
import {OptionsResolver} from '../../options-resolver';
import {ProfileCommand, ProfileOptions} from '../../profile.command';
import {MaxFeeValidator} from '../../validators/maxfee.validator';
import {PublicKeyValidator} from '../../validators/publicKey.validator';

export class CommandOptions extends ProfileOptions {
    @option({
        flag: 'p',
        description: 'Public key of the remote account',
        validator: new PublicKeyValidator(),
    })
    publickey: string;

    @option({
        flag: 'a',
        description: 'Alias action (0: Add, 1: Remove)',
    })
    action: number;

    @option({
        flag: 'f',
        description: 'Maximum fee',
        validator: new MaxFeeValidator(),
    })
    maxfee: number;
}

@command({
    description: 'Delegate the account importance to a proxy account',
})
export default class extends ProfileCommand {

    constructor() {
        super();
    }
    @metadata
    execute(options: CommandOptions) {
        const profile = this.getProfile(options);

        options.publickey = OptionsResolver(options,
            'publickey',
            () => undefined,
            'Introduce the public key of the remote account: ');

        options.action = OptionsResolver(options,
            'action',
            () => undefined,
            'Introduce alias action (0: Add, 1: Remove): ');

        options.maxfee = OptionsResolver(options,
            'maxfee',
            () => undefined,
            'Introduce the maximum fee you want to spend to announce the transaction: ');

        const accountLinkTransaction = AccountLinkTransaction.create(
            Deadline.create(),
            options.publickey,
            options.action,
            profile.networkType,
            UInt64.fromUint(options.maxfee),
        );

        const signedTransaction = profile.account.sign(accountLinkTransaction,
            profile.networkGenerationHash);
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
