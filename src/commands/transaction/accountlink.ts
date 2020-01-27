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
import {
    AnnounceTransactionFieldsTable,
    AnnounceTransactionsCommand,
    AnnounceTransactionsOptions,
} from '../../interfaces/announce.transactions.command';
import {LinkActionResolver} from '../../resolvers/action.resolver';
import {AnnounceResolver} from '../../resolvers/announce.resolver';
import {MaxFeeResolver} from '../../resolvers/maxFee.resolver';
import {PublicKeyResolver} from '../../resolvers/publicKey.resolver';

export class CommandOptions extends AnnounceTransactionsOptions {
    @option({
        flag: 'u',
        description: 'Remote account public key.',
    })
    publicKey: string;

    @option({
        flag: 'a',
        description: 'Alias action (1: Link, 0: Unlink).',
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
        const account = profile.decrypt(options);
        const publicKey = new PublicKeyResolver()
            .resolve(options, profile.networkType, 'Enter the public key of the remote account: ').publicKey;
        const action = new LinkActionResolver().resolve(options);
        const maxFee = new MaxFeeResolver().resolve(options);

        const transaction = AccountLinkTransaction.create(
            Deadline.create(),
            publicKey,
            action,
            profile.networkType,
            maxFee);

        const signedTransaction = account.sign(transaction, profile.networkGenerationHash);

        console.log(new AnnounceTransactionFieldsTable(signedTransaction, profile.url).toString('Transaction Information'));
        const shouldAnnounce = new AnnounceResolver().resolve(options);
        if (shouldAnnounce && options.sync) {
            this.announceTransactionSync(signedTransaction, profile.address, profile.url);
        } else if (shouldAnnounce) {
            this.announceTransaction(signedTransaction, profile.url);
        }
    }
}
