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
import {AnnounceTransactionsOptions} from '../../interfaces/announceTransactions.options'
import {AnnounceTransactionsCommand} from '../../interfaces/announce.transactions.command'
import {AddressAliasResolver} from '../../resolvers/address.resolver'
import {AnnounceResolver} from '../../resolvers/announce.resolver'
import {MaxFeeResolver} from '../../resolvers/maxFee.resolver'
import {MessageResolver} from '../../resolvers/message.resolver'
import {MosaicsResolver} from '../../resolvers/mosaic.resolver'
import {PublicKeyResolver} from '../../resolvers/publicKey.resolver'
import {TransactionView} from '../../views/transactions/details/transaction.view'
import {PasswordResolver} from '../../resolvers/password.resolver'
import {Address, Deadline, EmptyMessage, NamespaceId, PlainMessage, TransferTransaction} from 'symbol-sdk'
import {command, metadata, option} from 'clime'

export class CommandOptions extends AnnounceTransactionsOptions {
    @option({
        flag: 'r',
        description: 'Recipient address or @alias.',
    })
    recipientAddress: string

    @option({
        flag: 'm',
        description: 'Transaction message.',
    })
    message: string

    @option({
        flag: 'e',
        description: '(Optional) Send an encrypted message. ' +
            'If you set this value, you should set the value of \'recipientPublicKey\' as well).',
        toggle: true,
    })
    encrypted: any

    @option({
        flag: 'c',
        description: 'Mosaic to transfer in the format (mosaicId(hex)|@aliasName)::absoluteAmount. Add multiple mosaics with commas.',
    })
    mosaics: string

    @option({
        flag: 'u',
        description: '(Optional) Recipient public key in an encrypted message.',
    })
    recipientPublicKey: string
}

@command({
    description: 'Send transfer transaction',
})

export default class extends AnnounceTransactionsCommand {

    constructor() {
        super()
    }

    @metadata
    async execute(options: CommandOptions) {
        const profile = this.getProfile(options)
        const password = await new PasswordResolver().resolve(options)
        const account = profile.decrypt(password)
        const mosaics = await new MosaicsResolver().resolve(options)
        let recipientAddress: Address | NamespaceId
        let message = EmptyMessage
        if (options.encrypted) {
            const recipientPublicAccount = await new PublicKeyResolver()
                .resolve(options, profile.networkType,
                    'Enter the recipient public key:', 'recipientPublicKey')
            recipientAddress = recipientPublicAccount.address
            const rawMessage = await new MessageResolver().resolve(options)
            message = account.encryptMessage(rawMessage, recipientPublicAccount)
        } else {
            recipientAddress =  await new AddressAliasResolver()
                .resolve(options, undefined, 'Enter the recipient address or @alias:', 'recipientAddress')
            const rawMessage = await new MessageResolver().resolve(options)
            if (rawMessage) {
                message = PlainMessage.create(rawMessage)
            }
        }
        const maxFee = await new MaxFeeResolver().resolve(options)

        const transaction = TransferTransaction.create(
            Deadline.create(),
            recipientAddress,
            mosaics,
            message,
            profile.networkType,
            maxFee)
        const signedTransaction = account.sign(transaction, profile.networkGenerationHash)

        new TransactionView(transaction, signedTransaction).print()

        const shouldAnnounce = await new AnnounceResolver().resolve(options)
        if (shouldAnnounce && options.sync) {
            this.announceTransactionSync(signedTransaction, profile.address, profile.url)
        } else if (shouldAnnounce) {
            this.announceTransaction(signedTransaction, profile.url)
        }
    }
}
