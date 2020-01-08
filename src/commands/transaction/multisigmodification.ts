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
import chalk from 'chalk';
import {command, metadata, option} from 'clime';
import {
    AggregateTransaction,
    Deadline,
    HashLockTransaction,
    MultisigAccountModificationTransaction,
    NetworkCurrencyMosaic,
    UInt64,
} from 'nem2-sdk';
import {AnnounceAggregateTransactionsCommand, AnnounceAggregateTransactionsOptions} from '../../announce.aggregatetransactions.command';
import {ActionResolver} from '../../resolvers/action.resolver';
import {MaxFeeHashLockResolver, MaxFeeResolver} from '../../resolvers/maxFee.resolver';
import {CosignatoryPublicKeyResolver, MultisigAccountPublicKeyResolver} from '../../resolvers/publicKey.resolver';
import {BinaryValidator} from '../../validators/binary.validator';
import {PublicKeysValidator, PublicKeyValidator} from '../../validators/publicKey.validator';

export class CommandOptions extends AnnounceAggregateTransactionsOptions {
    @option({
        flag: 'R',
        description: '(Optional) Number of signatures needed to remove a cosignatory. ',
        default: 0,
    })
    minRemovalDelta: number;

    @option({
        flag: 'A',
        description: '(Optional) Number of signatures needed to approve a transaction.',
        default: 0,
    })
    minApprovalDelta: number;

    @option({
        flag: 'a',
        description: 'Modification Action (1: Add, 0: Remove).',
        validator: new BinaryValidator(),
    })
    action: number;

    @option({
        flag: 'p',
        description: 'Cosignatory accounts public keys (separated by a comma).',
        validator: new PublicKeysValidator(),
    })
    cosignatoryPublicKey: string;

    @option({
        flag: 'u',
        description: 'Multisig account public key.',
        validator: new PublicKeyValidator(),
    })
    multisigAccountPublicKey: string;
}

@command({
    description: 'Create or modify a multisig account',
})
export default class extends AnnounceAggregateTransactionsCommand {

    constructor() {
        super();
    }

    @metadata
    async execute(options: CommandOptions) {
        const profile = this.getProfile(options);
        const account = await profile.decrypt(options);
        const action = await new ActionResolver().resolve(options);
        const multisigAccount = await new MultisigAccountPublicKeyResolver().resolve(options, profile);
        const cosignatories = await new CosignatoryPublicKeyResolver().resolve(options, profile);
        const maxFee = await new MaxFeeResolver().resolve(options);
        const maxFeeHashLock = await new MaxFeeHashLockResolver().resolve(options);

        const multisigAccountModificationTransaction = MultisigAccountModificationTransaction.create(
            Deadline.create(),
            options.minApprovalDelta,
            options.minRemovalDelta,
            (action === 1) ? cosignatories : [],
            (action === 0) ? cosignatories : [],
            profile.networkType);

        const aggregateTransaction = AggregateTransaction.createBonded(
            Deadline.create(),
            [multisigAccountModificationTransaction.toAggregate(multisigAccount)],
            profile.networkType,
            [],
            maxFee);

        const signedTransaction = account.sign(aggregateTransaction, profile.networkGenerationHash);
        console.log(chalk.green('Aggregate Hash:   '), signedTransaction.hash);

        const hashLockTransaction = HashLockTransaction.create(
            Deadline.create(),
            NetworkCurrencyMosaic.createRelative(UInt64.fromNumericString(options.amount)),
            UInt64.fromNumericString(options.duration),
            signedTransaction,
            profile.networkType,
            maxFeeHashLock);
        const signedHashLockTransaction = account.sign(hashLockTransaction, profile.networkGenerationHash);
        console.log(chalk.green('HashLock Hash:   '), signedHashLockTransaction.hash);

        this.announceAggregateTransaction(
            signedHashLockTransaction,
            signedTransaction,
            account.address,
            profile.url);
    }
}
