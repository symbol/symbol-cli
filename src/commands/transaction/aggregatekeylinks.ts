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
import { Deadline, PlainMessage, PublicAccount, TransactionType, TransferTransaction } from 'symbol-sdk';
import { AnnounceTransactionsCommand } from '../../interfaces/announce.transactions.command';
import { AnnounceTransactionsOptions } from '../../interfaces/announce.transactions.options';
import { MultisigAccount } from '../../models/multisig.types';
import { AggregateTypeResolver } from '../../resolvers/aggregateType.resolver';
import { MaxFeeResolver } from '../../resolvers/maxFee.resolver';
import { MosaicsResolver } from '../../resolvers/mosaic.resolver';
import { PasswordResolver } from '../../resolvers/password.resolver';
import { PublicKeyResolver } from '../../resolvers/publicKey.resolver';
import { AccountService } from '../../services/account.service';
import { TransactionSignatureOptions } from '../../services/transaction.signature.service';
import AccountKeyLinkCommand from './accountkeylink';
import VotingKeyLinkCommand from './votingkeylink';
import VrfKeyLinkCommand from './vrfkeylink';

export class CommandOptions extends AnnounceTransactionsOptions {
    @option({
        description: 'Linked Remote Account Public Key.',
    })
    remotePublicKey: string;

    @option({
        description: 'Remote Account Key Link action (Link, Unlink).',
    })
    remoteLinkAction: string;

    @option({
        description: 'Linked Voting Account Public Key.',
    })
    votingPublicKey: string;

    @option({
        description: 'Voting Key Link Start Point.',
    })
    votingStartPoint: string;

    @option({
        description: 'Voting Key Link End Point.',
    })
    votingEndPoint: string;

    @option({
        description: 'Voting Key Link action (Link, Unlink).',
    })
    votingLinkAction: string;

    @option({
        description: 'Linked Vrf Account Public Key.',
    })
    vrfPublicKey: string;

    @option({
        description: 'Vrf Key Link action (Link, Unlink).',
    })
    vrfLinkAction: string;

    @option({
        flag: 't',
        description: 'Aggregate Type (complete or bonded)',
    })
    aggregateType: string;

    @option({
        description: 'Cosigner Account Public Key',
    })
    mainAccountPublicKey: string;

    @option({
        description: '(Optional) Enrol Transport Public Key',
    })
    enrolTransportPublicKey: string;

    @option({
        description: '(Optional) Enrol Agent url',
    })
    enrolAgentUrl: string;

    @option({
        description: '(Optional) Enrol Recipient Address',
    })
    enrolRecipientAdress: string;
}

@command({
    description:
        'Aggregates all key link transactions(Remote Account, Voting, Vrf) and optionally enrol transaction needed to set up a node.',
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
        const accountKeyLinkTx = await new AccountKeyLinkCommand().createTransaction(
            maxFee,
            options,
            profile,
            'remotePublicKey',
            'remoteLinkAction',
        );
        console.log('Voting Key Link Transaction:');
        const votingKeyLinkTx = await new VotingKeyLinkCommand().createTransaction(
            maxFee,
            options,
            profile,
            'votingPublicKey',
            'votingLinkAction',
            'votingStartPoint',
            'votingEndPoint',
        );
        console.log('Vrf Key Link Transaction:');
        const vrfKeyLinkTx = await new VrfKeyLinkCommand().createTransaction(maxFee, options, profile, 'vrfPublicKey', 'vrfLinkAction');

        const aggregateType = await new AggregateTypeResolver().resolve(options);

        const publicAccount = await new PublicKeyResolver().resolve(
            options,
            profile.networkType,
            'Cosigner account public key:',
            'mainAccountPublicKey',
        );
        const multisigSigner = ({ publicAccount } as unknown) as MultisigAccount;
        const transactions = [accountKeyLinkTx, votingKeyLinkTx, vrfKeyLinkTx];
        const transactionSigners: (PublicAccount | undefined)[] = [undefined, undefined, undefined];
        const zeroValueMosaics = await new MosaicsResolver().resolve({ mosaics: '@symbol.xym::0' });
        if (options.enrolTransportPublicKey && options.enrolAgentUrl) {
            const enrolRecipientAdress = AccountService.getUnresolvedAddress(
                options.enrolRecipientAdress ? options.enrolRecipientAdress : 'TDL73SDUMPDK7EOF7H3O4F5WB5WHG2SX7XUSFZQ',
            );
            const message = PlainMessage.create(`enrol ${options.enrolTransportPublicKey} ${options.enrolAgentUrl}`);

            transactions.push(
                TransferTransaction.create(
                    Deadline.create(profile.epochAdjustment),
                    enrolRecipientAdress,
                    zeroValueMosaics,
                    message,
                    profile.networkType,
                    maxFee,
                ),
            );
            transactionSigners.push(undefined);
        }

        // for an aggregate-bonded tx to be valid, an inner transaction(announcing account as a signer) needs to be added
        transactions.push(
            TransferTransaction.create(
                Deadline.create(profile.epochAdjustment),
                publicAccount.address,
                zeroValueMosaics,
                PlainMessage.create(''),
                profile.networkType,
                maxFee,
            ),
        );
        transactionSigners.push(account.publicAccount);

        const signatureOptions: TransactionSignatureOptions = {
            account,
            transactions,
            maxFee,
            multisigSigner,
            isAggregate: true,
            isAggregateBonded: aggregateType === TransactionType.AGGREGATE_BONDED,
            transactionSigners,
        };

        const signedTransactions = await this.signTransactions(signatureOptions, options);
        this.announceTransactions(options, signedTransactions);
    }
}
