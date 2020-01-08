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
import {Deadline, Mosaic, SecretLockTransaction} from 'nem2-sdk';
import {AnnounceTransactionsCommand, AnnounceTransactionsOptions} from '../../announce.transactions.command';
import {RecipientAddressResolver} from '../../resolvers/address.resolver';
import {AmountResolver} from '../../resolvers/amount.resolver';
import {DurationResolver} from '../../resolvers/duration.resolver';
import {HashAlgorithmResolver} from '../../resolvers/hashAlgorithm.resolver';
import {MaxFeeResolver} from '../../resolvers/maxFee.resolver';
import {MosaicIdAliasResolver} from '../../resolvers/mosaic.resolver';
import {SecretResolver} from '../../resolvers/secret.resolver';
import {AddressAliasValidator} from '../../validators/address.validator';
import {HashAlgorithmValidator} from '../../validators/hashAlgorithm.validator';
import {MosaicIdAliasValidator} from '../../validators/mosaicId.validator';
import {NumericStringValidator} from '../../validators/numericString.validator';

export class CommandOptions extends AnnounceTransactionsOptions {
    @option({
        description: 'Locked mosaic identifier or @alias.',
        flag: 'm',
        validator: new MosaicIdAliasValidator(),
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
        description: 'Address or @alias that receives the funds once unlocked.',
        flag: 'r',
        validator: new AddressAliasValidator(),
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
    async execute(options: CommandOptions) {
        const profile = this.getProfile(options);
        const account = await profile.decrypt(options);
        const mosaicId = await new MosaicIdAliasResolver()
            .resolve(options, undefined, 'Enter the locked mosaic identifier or alias: ');
        const amount = await new AmountResolver()
            .resolve(options, undefined, 'Enter the absolute amount of mosaic units to lock: ');
        const recipientAddress = await new RecipientAddressResolver()
            .resolve(options, undefined, 'Enter the address or @alias that receives the funds once unlocked: ');
        const duration = await new DurationResolver()
            .resolve(options, undefined, 'Enter the number of blocks for which a lock should be valid: ');
        const secret = await new SecretResolver().resolve(options);
        const hashAlgorithm = await new HashAlgorithmResolver().resolve(options);
        const maxFee = await new MaxFeeResolver().resolve(options);

        const secretLockTransaction = SecretLockTransaction.create(
            Deadline.create(),
            new Mosaic(mosaicId, amount),
            duration,
            hashAlgorithm,
            secret,
            recipientAddress,
            profile.networkType,
            maxFee);
        const signedTransaction = account.sign(secretLockTransaction, profile.networkGenerationHash);

        this.announceTransaction(signedTransaction, profile.url);
    }
}
