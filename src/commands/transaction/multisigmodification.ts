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
import {AnnounceTransactionsCommand} from '../../interfaces/announce.transactions.command'
import {AnnounceAggregateTransactionsOptions} from '../../interfaces/announceAggregateTransactions.options'
import {ActionResolver} from '../../resolvers/action.resolver'
import {AnnounceResolver} from '../../resolvers/announce.resolver'
import {MaxFeeResolver} from '../../resolvers/maxFee.resolver'
import {CosignatoryPublicKeyResolver, PublicKeyResolver} from '../../resolvers/publicKey.resolver'
import {TransactionView} from '../../views/transactions/details/transaction.view'
import {ActionType} from '../../models/action.enum'
import {PasswordResolver} from '../../resolvers/password.resolver'
import {
    AggregateTransaction,
    Deadline,
    HashLockTransaction,
    MultisigAccountModificationTransaction,
    UInt64,
} from 'symbol-sdk'
import {command, metadata, option} from 'clime'
import chalk from 'chalk'
import {DeltaResolver} from '../../resolvers/delta.resolver'

export class CommandOptions extends AnnounceAggregateTransactionsOptions {
    @option({
        flag: 'R',
        description: 'Number of signatures needed to remove a cosignatory. ' +
            'If the account already exists, enter the number of cosignatories to add or remove.',
    })
    minRemovalDelta: number

    @option({
        flag: 'A',
        description: 'Number of signatures needed to approve a transaction. ' +
            'If the account already exists, enter the number of cosignatories to add or remove.',
    })
    minApprovalDelta: number

    @option({
        flag: 'a',
        description: 'Modification Action (Add, Remove).',
    })
    action: string

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
        const password = await new PasswordResolver().resolve(options)
        const account = profile.decrypt(password)
        const action = await new ActionResolver().resolve(options)
        const multisigAccount = await new PublicKeyResolver()
            .resolve(options, profile.networkType,
                'Enter the multisig account public key:', 'multisigAccountPublicKey')
        const cosignatories = await new CosignatoryPublicKeyResolver().resolve(options, profile)
        const minApprovalDelta = await new DeltaResolver().resolve(options,
            'Enter the number of signatures needed to approve a transaction. ' +
            'If the account already exists, enter the number of cosignatories to add or remove:', 'minApprovalDelta' )
        const minRemovalDelta = await new DeltaResolver().resolve(options,
            'Enter the number of signatures needed to remove a cosignatory. ' +
            'If the account already exists, enter the number of cosignatories to add or remove:', 'minRemovalDelta' )
        const maxFee = await new MaxFeeResolver().resolve(options)
        const maxFeeHashLock = await new MaxFeeResolver().resolve(options,
            'Enter the maximum fee to announce the hashlock transaction (absolute amount):', 'maxFeeHashLock')

        const multisigAccountModificationTransaction = MultisigAccountModificationTransaction.create(
            Deadline.create(),
            minApprovalDelta,
            minRemovalDelta,
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
            profile.networkCurrency.createRelative(options.amount),
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
