/*
 *
 * Copyright 2018-present NEM
 *
 * Licensed under the Apache License, Version 2.0 (the "License")
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
import {command, metadata, option} from 'clime'
import {Deadline, PersistentHarvestingDelegationMessage, TransferTransaction} from 'nem2-sdk'
import {AnnounceTransactionsCommand, AnnounceTransactionsOptions} from '../../interfaces/announce.transactions.command'
import {AnnounceResolver} from '../../resolvers/announce.resolver'
import {MaxFeeResolver} from '../../resolvers/maxFee.resolver'
import {PublicKeyResolver} from '../../resolvers/publicKey.resolver'
import {TransactionView} from '../../views/transactions/details/transaction.view'
import {PrivateKeyResolver} from '../../resolvers/privateKey.resolver'

export class CommandOptions extends AnnounceTransactionsOptions {
    @option({
        flag: 'r',
        description: 'Private key of the remote account.',
    })
    remotePrivateKey: string

    @option({
        flag: 'u',
        description: 'Public key of the node to request persistent harvesting delegation.',
    })
    recipientPublicKey: string
}

@command({
    description: 'Requests a node to add a remote account as a delegated harvester',
})

export default class extends AnnounceTransactionsCommand {

    constructor() {
        super()
    }

    @metadata
    execute(options: CommandOptions) {
        const profile = this.getProfile(options)
        const account = profile.decrypt(options)
        const remotePrivateKey = new PrivateKeyResolver()
            .resolve(options, undefined, 'Enter the remote account private key: ', 'remotePrivateKey')
        const recipientPublicAccount = new PublicKeyResolver()
            .resolve(options, profile.networkType,
                'Enter the public key of the node: ', 'recipientPublicKey')
       const message = PersistentHarvestingDelegationMessage.create(
            remotePrivateKey,
            recipientPublicAccount.publicKey,
            profile.networkType)
        const maxFee = new MaxFeeResolver().resolve(options)

        const transaction = TransferTransaction.create(
            Deadline.create(),
            recipientPublicAccount.address,
            [],
            message,
            profile.networkType,
            maxFee)
        const signedTransaction = account.sign(transaction, profile.networkGenerationHash)

        new TransactionView(transaction, signedTransaction).print()

        const shouldAnnounce = new AnnounceResolver().resolve(options)
        if (shouldAnnounce && options.sync) {
            this.announceTransactionSync(signedTransaction, profile.address, profile.url)
        } else if (shouldAnnounce) {
            this.announceTransaction(signedTransaction, profile.url)
        }
    }
}
