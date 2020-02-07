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
import chalk from 'chalk'
import {command, metadata, option} from 'clime'
import {
    AggregateTransaction,
    Deadline,
    HashLockTransaction,
    MultisigAccountModificationTransaction,
    NetworkCurrencyMosaic,
    UInt64,
} from 'nem2-sdk'
import {AnnounceAggregateTransactionsOptions, AnnounceTransactionsCommand} from '../../interfaces/announce.transactions.command'
import {ActionResolver} from '../../resolvers/action.resolver'
import {AnnounceResolver} from '../../resolvers/announce.resolver'
import {MaxFeeResolver} from '../../resolvers/maxFee.resolver'
import {CosignatoryPublicKeyResolver, PublicKeyResolver} from '../../resolvers/publicKey.resolver'
import {TransactionView} from '../../views/transactions/details/transaction.view'
import {ActionType} from '../../interfaces/action.resolver'

export class CommandOptions extends AnnounceAggregateTransactionsOptions {
    @option({
        flag: 'R',
        description: '(Optional) Number of signatures needed to remove a cosignatory. ',
        default: 0,
    })
    minRemovalDelta: number

    @option({
        flag: 'A',
        description: '(Optional) Number of signatures needed to approve a transaction.',
        default: 0,
    })
    minApprovalDelta: number

    @option({
        flag: 'a',
        description: 'Modification Action (1: Add, 0: Remove).',
    })
    action: number

    @option({
        flag: 'p',
        description: 'Cosignatory accounts public keys (separated by a comma).',
    })
    cosignatoryPublicKey: string

    @option({
        flag: 'u',
        description: 'Multisig account public key.',
    })
    multisigAccountPublicKey: string
}

@command({
    description: 'Create or modify a multisig account',
})
export default class extends AnnounceTransactionsCommand {

    constructor() {
        super()
    }

    @metadata
    async execute(options: CommandOptions) {
        const profile = this.getProfile(options)
        const account = await profile.decrypt(options)
        const action = await new ActionResolver().resolve(options)
        const multisigAccount = await new PublicKeyResolver()
            .resolve(options, profile.networkType,
                'Enter the multisig account public key: ', 'multisigAccountPublicKey')
        const cosignatories = await new CosignatoryPublicKeyResolver().resolve(options, profile)
        const maxFee = await new MaxFeeResolver().resolve(options)
        const maxFeeHashLock = await new MaxFeeResolver().resolve(options, undefined,
            'Enter the maximum fee to announce the hashlock transaction (absolute amount): ', 'maxFeeHashLock')

        const multisigAccountModificationTransaction = MultisigAccountModificationTransaction.create(
            Deadline.create(),
            options.minApprovalDelta,
            options.minRemovalDelta,
            (action === ActionType.Add) ? cosignatories : [],
            (action === ActionType.Remove) ? cosignatories : [],
            profile.networkType)

        const aggregateTransaction = AggregateTransaction.createBonded(
            Deadline.create(),
            [multisigAccountModificationTransaction.toAggregate(multisigAccount)],
            profile.networkType,
            [],
            maxFee)

        const signedTransaction = account.sign(aggregateTransaction, profile.networkGenerationHash)
        console.log(chalk.green('Aggregate Hash:   '), signedTransaction.hash)

        const hashLockTransaction = HashLockTransaction.create(
            Deadline.create(),
            NetworkCurrencyMosaic.createRelative(UInt64.fromNumericString(options.amount)),
            UInt64.fromNumericString(options.duration),
            signedTransaction,
            profile.networkType,
            maxFeeHashLock)
        const signedHashLockTransaction = account.sign(hashLockTransaction, profile.networkGenerationHash)

        new TransactionView(aggregateTransaction, signedTransaction).print()
        new TransactionView(hashLockTransaction, signedHashLockTransaction).print()

        const shouldAnnounce = await new AnnounceResolver().resolve(options)
        if (shouldAnnounce) {
            this.announceAggregateTransaction(
                signedHashLockTransaction,
                signedTransaction,
                account.address,
                profile.url)
        }
    }
}
