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
import {command, ExpectedError, metadata, option} from 'clime';
import {AccountLinkTransaction, Deadline, Password, UInt64} from 'nem2-sdk';
import * as readlineSync from 'readline-sync';
import {AnnounceTransactionsCommand, AnnounceTransactionsOptions} from '../../announce.transactions.command';
import {OptionsResolver} from '../../options-resolver';
import {BinaryValidator} from '../../validators/binary.validator';
import {PasswordValidator} from '../../validators/password.validator';
import {PublicKeyValidator} from '../../validators/publicKey.validator';

export class CommandOptions extends AnnounceTransactionsOptions {
    @option({
        flag: 'u',
        description: 'Remote account public key.',
        validator: new PublicKeyValidator(),
    })
    publicKey: string;

    @option({
        flag: 'a',
        description: 'Alias action (1: Link, 0: Unlink).',
        validator: new BinaryValidator(),
    })
    action: number;

    @option({
        flag: 'p',
        description: '(Optional) Account password',
        validator: new PasswordValidator(),
    })
    password: string;
}

@command({
    description: 'Delegate the account importance to a proxy account',
})
export default class extends AnnounceTransactionsCommand {

    constructor() {
        super();
    }
    @metadata
    execute(options: CommandOptions) {
        const profile = this.getProfile(options);

        const password = options.password || readlineSync.question('Enter your wallet password: ');
        new PasswordValidator().validate(password);
        const passwordObject = new Password(password);

        if (!profile.isPasswordValid(passwordObject)) {
            throw new ExpectedError('The password you provided does not match your account password');
        }

        const account = profile.simpleWallet.open(passwordObject);

        options.publicKey = OptionsResolver(options,
            'publicKey',
            () => undefined,
            'Introduce the public key of the remote account: ');

        options.action = +OptionsResolver(options,
            'action',
            () => undefined,
            'Introduce alias action (1: Link, 0: Unlink): ');

        options.maxFee = OptionsResolver(options,
            'maxFee',
            () => undefined,
            'Introduce the maximum fee (absolute amount): ');

        const accountLinkTransaction = AccountLinkTransaction.create(
            Deadline.create(),
            options.publicKey,
            options.action,
            profile.networkType,
            options.maxFee ? UInt64.fromNumericString(options.maxFee) : UInt64.fromUint(0));

        const signedTransaction = account.sign(accountLinkTransaction,
            profile.networkGenerationHash);
        this.announceTransaction(signedTransaction, profile.url);
    }
}
