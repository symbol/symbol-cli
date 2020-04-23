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
import {command, metadata, option} from 'clime'
import {Deadline, MultisigAccountModificationTransaction} from 'symbol-sdk'

import {ActionResolver} from '../../resolvers/action.resolver'
import {ActionType} from '../../models/action.enum'
import {AnnounceTransactionsCommand} from '../../interfaces/announce.transactions.command'
import {AnnounceTransactionsOptions} from '../../interfaces/announceTransactions.options'
import {CosignatoryPublicKeyResolver} from '../../resolvers/publicKey.resolver'
import {DeltaResolver} from '../../resolvers/delta.resolver'
import {MaxFeeResolver} from '../../resolvers/maxFee.resolver'
import {PasswordResolver} from '../../resolvers/password.resolver'
import {TransactionSignatureOptions} from '../../services/transaction.signature.service'

export class CommandOptions extends AnnounceTransactionsOptions {
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
    constructor() { super() }

    @metadata
    async execute(options: CommandOptions) {
        const profile = this.getProfile(options)
        const password = await new PasswordResolver().resolve(options)
        const account = profile.decrypt(password)
        const action = await new ActionResolver().resolve(options)
        const cosignatories = await new CosignatoryPublicKeyResolver().resolve(options, profile)
        const minApprovalDelta = await new DeltaResolver().resolve(options,
            'Enter the number of signatures needed to approve a transaction. ' +
            'If the account already exists, enter the number of cosignatories to add or remove:', 'minApprovalDelta' )
        const minRemovalDelta = await new DeltaResolver().resolve(options,
            'Enter the number of signatures needed to remove a cosignatory. ' +
            'If the account already exists, enter the number of cosignatories to add or remove:', 'minRemovalDelta' )
        const maxFee = await new MaxFeeResolver().resolve(options)
        const signerMultisigInfo = await this.getSignerMultisigInfo(options)

        const multisigAccountModificationTransaction = MultisigAccountModificationTransaction.create(
            Deadline.create(),
            minApprovalDelta,
            minRemovalDelta,
            (action === ActionType.Add) ? cosignatories : [],
            (action === ActionType.Remove) ? cosignatories : [],
            profile.networkType,
        )

        const signatureOptions: TransactionSignatureOptions = {
            account,
            transactions: [multisigAccountModificationTransaction],
            maxFee,
            signerMultisigInfo,
            isAggregateBonded: true,
        }

        this.signAndAnnounce(signatureOptions, options)
    }
}
