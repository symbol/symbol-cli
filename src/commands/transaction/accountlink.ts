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
import {AccountLinkTransaction, Deadline} from 'nem2-sdk';
import {AnnounceTransactionsCommand, AnnounceTransactionsOptions} from '../../announce.transactions.command';
import {LinkActionResolver} from '../../resolvers/action.resolver';
import {MaxFeeResolver} from '../../resolvers/maxFee.resolver';
import {PublicKeyResolver} from '../../resolvers/publicKey.resolver';
import {BinaryValidator} from '../../validators/binary.validator';
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
}

@command({
    description: 'Delegate the account importance to a proxy account',
})
export default class extends AnnounceTransactionsCommand {

    constructor() {
        super();
    }
    @metadata
    async execute(options: CommandOptions) {
        const profile = this.getProfile(options);
        const account = await profile.decrypt(options);
        const publicKey = await new PublicKeyResolver().resolve(options, profile, 'Enter the public key of the remote account: ');
        const action = new LinkActionResolver().resolve(options);
        const maxFee = await new MaxFeeResolver().resolve(options);

        const accountLinkTransaction = AccountLinkTransaction.create(
            Deadline.create(),
            publicKey,
            action,
            profile.networkType,
            maxFee);

        const signedTransaction = account.sign(accountLinkTransaction,
            profile.networkGenerationHash);
        this.announceTransaction(signedTransaction, profile.url);
    }
}
