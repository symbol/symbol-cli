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
import {AnnounceResolver} from '../../resolvers/announce.resolver'
import {DurationResolver} from '../../resolvers/duration.resolver'
import {MaxFeeResolver} from '../../resolvers/maxFee.resolver'
import {NamespaceNameStringResolver, NamespaceTypeResolver} from '../../resolvers/namespace.resolver'
import {TransactionView} from '../../views/transactions/details/transaction.view'
import {PasswordResolver} from '../../resolvers/password.resolver'
import {Deadline, NamespaceRegistrationTransaction, NamespaceRegistrationType} from 'symbol-sdk'
import {command, metadata, option} from 'clime'

export class CommandOptions extends AnnounceTransactionsOptions {
    @option({
        flag: 'n',
        description: 'Namespace name.',
    })
    name: string

    @option({
        flag: 'r',
        description: 'Root namespace.',
        toggle: true,
    })
    rootnamespace: any

    @option({
        flag: 's',
        description: 'Sub namespace.',
        toggle: true,
    })
    subnamespace: any

    @option({
        flag: 'd',
        description: 'Duration (use it with --rootnamespace).',
    })
    duration: string

    @option({
        flag: 'a',
        description: 'Parent namespace name (use it with --subnamespace).',
    })
    parentName: string
}

@command({
    description: 'Register a namespace',
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
        const name = await new NamespaceNameStringResolver().resolve(options, undefined, 'name')
        const namespaceType = await new NamespaceTypeResolver().resolve(options)
        const maxFee = await new MaxFeeResolver().resolve(options)

        let transaction: NamespaceRegistrationTransaction
        if (namespaceType === NamespaceRegistrationType.RootNamespace) {
            const duration = await new DurationResolver().resolve(options)
            transaction = NamespaceRegistrationTransaction.createRootNamespace(
                Deadline.create(), name, duration, profile.networkType, maxFee)
        } else {
            const parentName = await new NamespaceNameStringResolver()
                .resolve(options, 'Enter the parent namespace name:', 'parentName')
            transaction = NamespaceRegistrationTransaction.createSubNamespace(
                Deadline.create(), name, parentName, profile.networkType, maxFee)
        }
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
