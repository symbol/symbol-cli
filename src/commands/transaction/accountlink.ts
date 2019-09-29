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
import {command, metadata, option} from 'clime';
import {AccountLinkTransaction, Deadline, UInt64} from 'nem2-sdk';
import {AnnounceTransactionsCommand, AnnounceTransactionsOptions} from '../../announce.transactions.command';
import {OptionsResolver} from '../../options-resolver';
import {BinaryValidator} from '../../validators/binary.validator';
import {PublicKeyValidator} from '../../validators/publicKey.validator';

export class CommandOptions extends AnnounceTransactionsOptions {
    @option({
        flag: 'p',
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

        options.publicKey = OptionsResolver(options,
            'publicKey',
            () => undefined,
            'Introduce the public key of the remote account: ');

        options.action = OptionsResolver(options,
            'action',
            () => undefined,
            'Introduce alias action (1: Link, 0: Unlink): ');

        options.maxFee = OptionsResolver(options,
            'maxFee',
            () => undefined,
            'Introduce the maximum fee you want to spend to announce the transaction: ');

        const accountLinkTransaction = AccountLinkTransaction.create(
            Deadline.create(),
            options.publicKey,
            options.action,
            profile.networkType,
            UInt64.fromUint(options.maxFee),
        );

        const signedTransaction = profile.account.sign(accountLinkTransaction,
            profile.networkGenerationHash);
        this.announceTransaction(signedTransaction, profile.url);
    }
}
