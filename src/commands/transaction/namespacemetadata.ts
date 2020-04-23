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
import {command, metadata, option} from 'clime'
import {Deadline, MetadataHttp, MetadataTransactionService, MetadataType} from 'symbol-sdk'

import {AnnounceTransactionsCommand} from '../../interfaces/announce.transactions.command'
import {AnnounceTransactionsOptions} from '../../interfaces/announceTransactions.options'
import {KeyResolver} from '../../resolvers/key.resolver'
import {MaxFeeResolver} from '../../resolvers/maxFee.resolver'
import {NamespaceIdResolver} from '../../resolvers/namespace.resolver'
import {PasswordResolver} from '../../resolvers/password.resolver'
import {PublicKeyResolver} from '../../resolvers/publicKey.resolver'
import {StringResolver} from '../../resolvers/string.resolver'
import {TransactionSignatureOptions} from '../../services/transaction.signature.service'

export class CommandOptions extends AnnounceTransactionsOptions {
    @option({
        flag: 'n',
        description: 'Mosaic id be assigned metadata in hexadecimal format.',
    })
    namespaceId: string

    @option({
        flag: 't',
        description: 'Namespace id owner account public key.',
    })
    targetPublicKey: string

    @option({
        flag: 'k',
        description: 'Key of metadata.',
    })
    key: string

    @option({
        flag: 'v',
        description: 'Metadata key (UInt64) in hexadecimal format.',
    })
    value: string
}

@command({
    description: 'Add custom data to a namespace (requires internet)',
})
export default class extends AnnounceTransactionsCommand {
    constructor() { super() }

    @metadata
    async execute(options: CommandOptions) {
        const profile = this.getProfile(options)
        const password = await new PasswordResolver().resolve(options)
        const account = profile.decrypt(password)
        const namespaceId = await new NamespaceIdResolver().resolve(options)
        const targetAccount = await new PublicKeyResolver()
            .resolve(options, profile.networkType,
                'Enter the namespace owner account public key:', 'targetPublicKey')
        const key = await new KeyResolver().resolve(options)
        const value = await new StringResolver().resolve(options)
        const maxFee = await new MaxFeeResolver().resolve(options)
        const signerMultisigInfo = await this.getSignerMultisigInfo(options)

        const metadataHttp = new MetadataHttp(profile.url)
        const metadataTransactionService = new MetadataTransactionService(metadataHttp)
        const metadataTransaction = await metadataTransactionService.createMetadataTransaction(
            Deadline.create(),
            account.networkType,
            MetadataType.Namespace,
            targetAccount,
            key,
            value,
            account.publicAccount,
            namespaceId,
            maxFee,
        ).toPromise()

        const signatureOptions: TransactionSignatureOptions = {
            account,
            transactions: [metadataTransaction],
            maxFee,
            signerMultisigInfo,
            isAggregateBonded: targetAccount.publicKey !== account.publicKey,
        }

        this.signAndAnnounce(signatureOptions, options)
    }
}
