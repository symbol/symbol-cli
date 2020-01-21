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
import {Deadline, EmptyMessage, PersistentHarvestingDelegationMessage, PlainMessage, TransferTransaction} from 'nem2-sdk';
import {
    AnnounceTransactionFieldsTable,
    AnnounceTransactionsCommand,
    AnnounceTransactionsOptions,
} from '../../announce.transactions.command';
import {AddressAliasResolver} from '../../resolvers/address.resolver';
import {AnnounceResolver} from '../../resolvers/announce.resolver';
import {MaxFeeResolver} from '../../resolvers/maxFee.resolver';
import {MessageResolver, RecipientPublicKeyResolver} from '../../resolvers/message.resolver';
import {MosaicsResolver} from '../../resolvers/mosaic.resolver';

export class CommandOptions extends AnnounceTransactionsOptions {
    @option({
        flag: 'r',
        description: 'Recipient address or @alias.',
    })
    recipientAddress: string;

    @option({
        flag: 'm',
        description: 'Transaction message.',
    })
    message: string;

    @option({
        flag: 'c',
        description: 'Mosaic to transfer in the format (mosaicId(hex)|@aliasName)::absoluteAmount. Add multiple mosaics with commas.',
    })
    mosaics: string;

    @option({
        flag: 'e',
        description: '(Optional) Send an encrypted message. ' +
            'If you set this value, you should set the value of \'recipientPublicKey\' as well).',
        toggle: true,
    })
    encrypted: any;

    @option({
        flag: 'u',
        description: '(Optional) The recipient public key in an encrypted message.',
    })
    recipientPublicKey: string;

    @option({
        flag: 'd',
        description: '(Optional) Start persistent harvesting delegation.',
        toggle: true,
    })
    persistentHarvestingDelegation: any;
}

@command({
    description: 'Send transfer transaction',
})

export default class extends AnnounceTransactionsCommand {

    constructor() {
        super();
    }

    @metadata
    execute(options: CommandOptions) {
        const profile = this.getProfile(options);
        const account = profile.decrypt(options);
        const recipientAddress = new AddressAliasResolver()
            .resolve(options, undefined, 'Enter the recipient address or @alias: ', 'recipientAddress');
        const mosaics = new MosaicsResolver().resolve(options);
        const rawMessage = new MessageResolver().resolve(options);
        let message = EmptyMessage;
        if (rawMessage) {
            if (options.persistentHarvestingDelegation) {
                const recipientPublicAccount = new RecipientPublicKeyResolver().resolve(options, profile);
                message = PersistentHarvestingDelegationMessage.create(
                    rawMessage,
                    account.privateKey,
                    recipientPublicAccount.publicKey,
                    profile.networkType);
            } else if (options.encrypted) {
                const recipientPublicAccount = new RecipientPublicKeyResolver().resolve(options, profile);
                message = account.encryptMessage(
                    rawMessage,
                    recipientPublicAccount,
                    profile.networkType);
            } else {
                message = PlainMessage.create(rawMessage);
            }
        }
        const maxFee = new MaxFeeResolver().resolve(options);

        const transaction = TransferTransaction.create(
            Deadline.create(),
            recipientAddress,
            mosaics,
            message,
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
