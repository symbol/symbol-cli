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
import {SupplyActionResolver} from '../../resolvers/action.resolver'
import {AmountResolver} from '../../resolvers/amount.resolver'
import {AnnounceResolver} from '../../resolvers/announce.resolver'
import {MaxFeeResolver} from '../../resolvers/maxFee.resolver'
import {MosaicIdResolver} from '../../resolvers/mosaic.resolver'
import {TransactionView} from '../../views/transactions/details/transaction.view'
import {PasswordResolver} from '../../resolvers/password.resolver'
import {Deadline, MosaicSupplyChangeTransaction} from 'symbol-sdk'
import {command, metadata, option} from 'clime'

export class CommandOptions extends AnnounceTransactionsOptions {
    @option({
        flag: 'a',
        description: 'Mosaic supply change action (Increase, Decrease).',
    })
    action: string

    @option({
        flag: 'm',
        description: 'Mosaic id in hexadecimal format.',
    })
    mosaicId: string

    @option({
        flag: 'd',
        description: 'Atomic amount of supply change.',
    })
    amount: string
}

@command({
    description: 'Change a mosaic supply',
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
        const mosaicId = await new MosaicIdResolver().resolve(options)
        const action = await new SupplyActionResolver().resolve(options)
        const amount = await new AmountResolver()
            .resolve(options, 'Enter absolute amount of supply change: ')
        const maxFee = await new MaxFeeResolver().resolve(options)

        const transaction = MosaicSupplyChangeTransaction.create(
            Deadline.create(),
            mosaicId,
            action,
            amount,
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
