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
import {ActionResolver} from '../../resolvers/action.resolver'
import {AnnounceResolver} from '../../resolvers/announce.resolver'
import {MaxFeeResolver} from '../../resolvers/maxFee.resolver'
import {MosaicIdAliasResolver} from '../../resolvers/mosaic.resolver'
import {RestrictionAccountMosaicFlagsResolver} from '../../resolvers/restrictionAccount.resolver'
import {TransactionView} from '../../views/transactions/details/transaction.view'
import {ActionType} from '../../models/action.enum'
import {PasswordResolver} from '../../resolvers/password.resolver'
import {AccountRestrictionTransaction, Deadline} from 'symbol-sdk'
import {command, metadata, option} from 'clime'

export class CommandOptions extends AnnounceTransactionsOptions {
    @option({
        flag: 'f',
    description: 'Restriction flags.(AllowMosaic,' +
        'BlockMosaic)',
})
    flags: string

    @option({
        flag: 'a',
        description: 'Modification action. (Add, Remove).',
    })
    action: string

    @option({
        flag: 'v',
        description: 'Mosaic or @alias to allow / block.',
    })
    mosaicId: string
}

@command({
    description: 'Allow or block incoming transactions containing a given set of mosaics',
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
        const flags = await new RestrictionAccountMosaicFlagsResolver().resolve(options)
        const mosaic = await new MosaicIdAliasResolver().resolve(options)
        const maxFee = await new MaxFeeResolver().resolve(options)

        const transaction = AccountRestrictionTransaction.createMosaicRestrictionModificationTransaction(
            Deadline.create(),
            flags,
            (action === ActionType.Add) ? [mosaic] : [],
            (action === ActionType.Remove) ? [mosaic] : [],
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
