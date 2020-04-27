/*
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
import {HashAlgorithmResolver} from '../../resolvers/hashAlgorithm.resolver'
import {MaxFeeResolver} from '../../resolvers/maxFee.resolver'
import {ProofResolver} from '../../resolvers/proof.resolver'
import {SecretResolver} from '../../resolvers/secret.resolver'
import {TransactionView} from '../../views/transactions/details/transaction.view'
import {PasswordResolver} from '../../resolvers/password.resolver'
import {Deadline, SecretProofTransaction} from 'symbol-sdk'
import {command, metadata, option} from 'clime'

export class SecretProofCommandOptions extends AnnounceTransactionsOptions {

    @option({
        description: 'Proof hashed in hexadecimal. ',
        flag: 's',
    })
    secret: string

    @option({
        description: 'Original random set of bytes in hexadecimal. ',
        flag: 'p',
    })
    proof: string

    @option({
        description: 'Algorithm used to hash the proof (Op_Sha3_256, Op_Hash_160, Op_Hash_256). ',
        flag: 'H',
    })
    hashAlgorithm: string

    @option({
        description: 'Address or @alias that receives the funds once unlocked.',
        flag: 'r',
    })
    recipientAddress: string
}

@command({
    description: 'Announce a secret proof transaction',
})
export default class extends AnnounceTransactionsCommand {
    constructor() {
        super()
    }

    @metadata
    async execute(options: SecretProofCommandOptions) {
        const profile = this.getProfile(options)
        const password = await new PasswordResolver().resolve(options)
        const account = profile.decrypt(password)
        const recipientAddress = await new AddressAliasResolver()
            .resolve(options, undefined, 'Enter the address (or @alias) that receives the funds once unlocked:', 'recipientAddress')
        const secret = await new SecretResolver().resolve(options)
        const hashAlgorithm = await new HashAlgorithmResolver().resolve(options)
        const proof = await new ProofResolver().resolve(options, hashAlgorithm)
        const maxFee = await new MaxFeeResolver().resolve(options)

        const transaction = SecretProofTransaction.create(
            Deadline.create(),
            hashAlgorithm,
            secret,
            recipientAddress,
            proof,
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
