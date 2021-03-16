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
import { command, metadata, option } from 'clime';
import { TransactionType } from 'symbol-sdk';
import { AnnounceTransactionsCommand } from '../../interfaces/announce.transactions.command';
import { AnnounceTransactionsOptions } from '../../interfaces/announce.transactions.options';
import { MultisigAccount } from '../../models/multisig.types';
import { AggregateTypeResolver } from '../../resolvers/aggregateType.resolver';
import { MaxFeeResolver } from '../../resolvers/maxFee.resolver';
import { PasswordResolver } from '../../resolvers/password.resolver';
import { PublicKeyResolver } from '../../resolvers/publicKey.resolver';
import { TransactionSignatureOptions } from '../../services/transaction.signature.service';
import AccountKeyLinkCommand from './accountkeylink';
import VotingKeyLinkCommand from './votingkeylink';
import VrfKeyLinkCommand from './vrfkeylink';

export class CommandOptions extends AnnounceTransactionsOptions {
    @option({
        flag: 'u',
        description: 'Linked Account Public Key.',
    })
    linkedAccountPublicKey: string;

    @option({
        flag: 'a',
        description: 'Alias action (Link, Unlink).',
    })
    action: string;

    @option({
        description: 'BLS Linked Public Key.',
    })
    linkedPublicKey: string;

    @option({
        description: 'Start Point.',
    })
    startPoint: string;

    @option({
        description: 'End Point.',
    })
    endPoint: string;

    @option({
        flag: 'a',
        description: 'Alias action (Link, Unlink).',
    })
    action2: string;
}

@command({
    description: 'Delegate the account importance to a proxy account. Required for all accounts willing to activate delegated harvesting.',
})
export default class extends AnnounceTransactionsCommand {
    constructor() {
        super();
    }

    @metadata
    async execute(options: CommandOptions) {
        const profile = this.getProfile(options);
        const password = await new PasswordResolver().resolve(options);
        const account = profile.decrypt(password);
        
        const maxFee = await new MaxFeeResolver().resolve(options);

        console.log('Acccount Key Link Transaction:');
        const accountKeyLinkTx = await new AccountKeyLinkCommand().createTransaction(maxFee, options, profile);
        console.log('Voting Key Link Transaction:');
        const votingKeyLinkTx = await new VotingKeyLinkCommand().createTransaction(maxFee, options, profile);
        console.log('Vrf Key Link Transaction:');
        const vrfKeyLinkTx = await new VrfKeyLinkCommand().createTransaction(maxFee, options, profile);


        const aggregateType = await new AggregateTypeResolver().resolve(options);
        
        console.log('Cosigner account:')
        const publicAccount = await new PublicKeyResolver().resolve(options, profile.networkType);
        const multisigSigner = ({publicAccount } as unknown) as MultisigAccount;

        const signatureOptions: TransactionSignatureOptions = {
            account,
            transactions: [accountKeyLinkTx, votingKeyLinkTx, vrfKeyLinkTx],
            maxFee,
            multisigSigner,
            isAggregate: true,
            isAggregateBonded: aggregateType === TransactionType.AGGREGATE_BONDED,
        };

        const signedTransactions = await this.signTransactions(signatureOptions, options);
        this.announceTransactions(options, signedTransactions);
    }
}
