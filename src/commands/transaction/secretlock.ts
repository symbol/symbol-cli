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
import {command, metadata, option} from 'clime';
import {Address, Deadline, Mosaic, MosaicId, SecretLockTransaction, UInt64} from 'nem2-sdk';
import {AnnounceTransactionsCommand, AnnounceTransactionsOptions} from '../../announce.transactions.command';
import {OptionsResolver} from '../../options-resolver';
import {AddressValidator} from '../../validators/address.validator';
import {HashAlgorithmValidator} from '../../validators/hashAlgorithm.validator';
import {MosaicIdValidator} from '../../validators/mosaicId.validator';
import {NumericStringValidator} from '../../validators/numericString.validator';

export class CommandOptions extends AnnounceTransactionsOptions {
    @option({
        description: 'Locked mosaic identifier.',
        flag: 'm',
        validator: new MosaicIdValidator(),
    })
    mosaicId: string;

    @option({
        description: 'Amount of mosaic units to lock.',
        flag: 'a',
        validator: new NumericStringValidator(),
    })
    amount: string;

    @option({
        description: 'Number of blocks for which a lock should be valid. ' +
            'Duration is allowed to lie up to 30 days. If reached, the mosaics will be returned to the initiator.',
        flag: 'd',
        validator: new NumericStringValidator(),
    })
    duration: string;

    @option({
        description: 'Proof hashed in hexadecimal format.',
        flag: 's',
    })
    secret: string;

    @option({
        description: 'Algorithm used to hash the proof (0: Op_Sha3_256, 1: Op_Keccak_256, 2: Op_Hash_160, 3: Op_Hash_256).',
        flag: 'H',
        validator: new HashAlgorithmValidator(),
    })
    hashAlgorithm: number;

    @option({
        description: 'Address that receives the funds once unlocked.',
        flag: 'r',
        validator: new AddressValidator(),
    })
    recipientAddress: string;
}

@command({
    description: 'Announce a secret lock transaction',
})
export default class extends AnnounceTransactionsCommand {
    constructor() {
        super();
    }

    @metadata
    execute(options: CommandOptions) {
        options.mosaicId = OptionsResolver(options,
            'mosaicId',
            () => undefined,
            'Introduce locked mosaic identifier: ');

        options.amount = OptionsResolver(options,
            'amount',
            () => undefined,
            'Introduce amount of mosaic units to lock: ');

        options.recipientAddress = OptionsResolver(options,
            'recipientAddress',
            () => undefined,
            'Introduce address that receives the funds once unlocked: ');
        const recipientAddress =  Address.createFromRawAddress(options.recipientAddress);

        options.duration = OptionsResolver(options,
            'duration',
            () => undefined,
            'Introduce number of blocks for which a lock should be valid: ');

        options.secret = OptionsResolver(options,
            'secret',
            () => undefined,
            'Introduce proof hashed in hexadecimal format: ');

        options.hashAlgorithm = +OptionsResolver(options,
            'hashAlgorithm',
            () => undefined,
            'Introduce algorithm used to hash the proof (0: Op_Sha3_256, 1: Op_Keccak_256, 2: Op_Hash_160, 3: Op_Hash_256): ');

        options.maxFee = OptionsResolver(options,
            'maxFee',
            () => undefined,
            'Introduce the maximum fee you want to spend to announce the transaction: ');

        const profile = this.getProfile(options);

        const secretLockTransaction = SecretLockTransaction.create(
            Deadline.create(),
            new Mosaic(new MosaicId(options.mosaicId),
                UInt64.fromNumericString(options.amount)),
            UInt64.fromNumericString(options.duration),
            options.hashAlgorithm,
            options.secret,
            recipientAddress,
            profile.networkType,
            options.maxFee ? UInt64.fromNumericString(options.maxFee) : UInt64.fromUint(0));
        const signedTransaction = profile.account.sign(secretLockTransaction, profile.networkGenerationHash);

        this.announceTransaction(signedTransaction, profile.url);
    }
}
