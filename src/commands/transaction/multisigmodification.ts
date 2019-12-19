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
import {command, ExpectedError, metadata, option} from 'clime';
import {
    AggregateTransaction,
    Deadline,
    HashLockTransaction,
    MultisigAccountModificationTransaction,
    NetworkCurrencyMosaic,
    Password,
    PublicAccount,
    UInt64,
} from 'nem2-sdk';
import * as readlineSync from 'readline-sync';
import {AnnounceAggregateTransactionsCommand, AnnounceAggregateTransactionsOptions} from '../../announce.aggregatetransactions.command';
import {OptionsResolver} from '../../options-resolver';
import {BinaryValidator} from '../../validators/binary.validator';
import {PasswordValidator} from '../../validators/password.validator';
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
        flag: 'm',
        description: 'Multisig account public key.',
        validator: new PublicKeyValidator(),
    })
    multisigAccountPublicKey: string;

    @option({
        flag: 'p',
        description: '(Optional) Account password',
        validator: new PasswordValidator(),
    })
    password: string;
}

@command({
    description: 'Create or modify a multisig account',
})
export default class extends AnnounceAggregateTransactionsCommand {

    constructor() {
        super();
    }

    @metadata
    execute(options: CommandOptions) {
        const profile = this.getProfile(options);

        const password = options.password || readlineSync.question('Enter your wallet password: ');
        new PasswordValidator().validate(password);
        const passwordObject = new Password(password);

        if (!profile.isPasswordValid(passwordObject)) {
            throw new ExpectedError('The password you provided does not match your account password');
        }

        const account = profile.simpleWallet.open(passwordObject);

        options.action = +OptionsResolver(options,
            'action',
            () => undefined,
            'Introduce the modification action (1: Add, 0: Remove): ');

        options.cosignatoryPublicKey = OptionsResolver(options,
            'cosignatoryPublicKey',
            () => undefined,
            'Introduce the cosignatory accounts public keys (separated by a comma): ');

        options.multisigAccountPublicKey = OptionsResolver(options,
            'multisigAccountPublicKey',
            () => undefined,
            'Introduce the multisig account public key: ');

        options.maxFee = OptionsResolver(options,
            'maxFee',
            () => undefined,
            'Introduce the maximum fee you want to spend to announce the multisig modification transaction: ');

        options.maxFeeHashLock = OptionsResolver(options,
            'maxFeeHashLock',
            () => undefined,
            'Introduce the maximum fee you want to spend to announce the hashlock transaction: ');

        const cosignatoryPublicKeys = options.cosignatoryPublicKey.split(',');
        const cosignatories: PublicAccount[] = [];
        cosignatoryPublicKeys.map((cosignatory: string) => {
            cosignatories.push(PublicAccount.createFromPublicKey(cosignatory, profile.networkType));
        });
        const multisigAccount = PublicAccount.createFromPublicKey(options.multisigAccountPublicKey, profile.networkType);

        const multisigAccountModificationTransaction = MultisigAccountModificationTransaction.create(
            Deadline.create(),
            options.minApprovalDelta,
            options.minRemovalDelta,
            (options.action === 1) ? cosignatories : [],
            (options.action === 0) ? cosignatories : [],
            profile.networkType);

        const aggregateTransaction = AggregateTransaction.createBonded(
            Deadline.create(),
            [multisigAccountModificationTransaction.toAggregate(multisigAccount)],
            profile.networkType,
            [],
            options.maxFee ? UInt64.fromNumericString(options.maxFee) : UInt64.fromUint(0));

        const signedTransaction = account.sign(aggregateTransaction, profile.networkGenerationHash);
        console.log(chalk.green('Aggregate Hash:   '), signedTransaction.hash);

        const hashLockTransaction = HashLockTransaction.create(
            Deadline.create(),
            NetworkCurrencyMosaic.createRelative(UInt64.fromNumericString(options.amount)),
            UInt64.fromNumericString(options.duration),
            signedTransaction,
            profile.networkType,
            options.maxFeeHashLock ? UInt64.fromNumericString(options.maxFeeHashLock) : UInt64.fromUint(0));
        const signedHashLockTransaction = account.sign(hashLockTransaction, profile.networkGenerationHash);
        console.log(chalk.green('HashLock Hash:   '), signedHashLockTransaction.hash);

        this.announceAggregateTransaction(
            signedHashLockTransaction,
            signedTransaction,
            account.address,
            profile.url);
    }
}
