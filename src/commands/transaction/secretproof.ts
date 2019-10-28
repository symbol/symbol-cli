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
import {Address, Deadline, SecretProofTransaction, UInt64} from 'nem2-sdk';
import {AnnounceTransactionsCommand, AnnounceTransactionsOptions} from '../../announce.transactions.command';
import {OptionsResolver} from '../../options-resolver';
import {AddressValidator} from '../../validators/address.validator';
import {HashAlgorithmValidator} from '../../validators/hashAlgorithm.validator';

export class CommandOptions extends AnnounceTransactionsOptions {

    @option({
        description: 'Proof hashed in hexadecimal. ',
        flag: 's',
    })
    secret: string;

    @option({
        description: 'Original random set of bytes in hexadecimal. ',
        flag: 'p',
    })
    proof: string;

    @option({
        description: 'Algorithm used to hash the proof (0: Op_Sha3_256, 1: Op_Keccak_256, 2: Op_Hash_160, 3: Op_Hash_256). ',
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
    description: 'Creates a secret proof transaction',
})
export default class extends AnnounceTransactionsCommand {
    constructor() {
        super();
    }

    @metadata
    execute(options: CommandOptions) {
        options.secret = OptionsResolver(options,
            'secret',
            () => undefined,
            'Introduce proof hashed in hexadecimal: ');

        options.proof = OptionsResolver(options,
            'proof',
            () => undefined,
            'Introduce original random set of bytes in hexadecimal: ');

        options.hashAlgorithm = OptionsResolver(options,
            'hashAlgorithm',
            () => undefined,
            'Introduce algorithm used to hash the proof(0: Op_Sha3_256, 1: Op_Keccak_256, 2: Op_Hash_160, 3: Op_Hash_256): ');

        options.recipientAddress = OptionsResolver(options,
            'recipientAddress',
            () => undefined,
            'Introduce address that receives the funds once unlocked: ');
        const recipientAddress = Address.createFromRawAddress(options.recipientAddress);

        options.maxFee = OptionsResolver(options,
            'maxFee',
            () => undefined,
            'Introduce the maximum fee you want to spend to announce the transaction: ');

        const profile = this.getProfile(options);

        const secretProofTransaction = SecretProofTransaction.create(
            Deadline.create(),
            options.hashAlgorithm,
            options.secret,
            recipientAddress,
            options.proof,
            profile.networkType,
            options.maxFee ? UInt64.fromNumericString(options.maxFee) : UInt64.fromUint(0));
        const signedTransaction = profile.account.sign(secretProofTransaction, profile.networkGenerationHash);

        this.announceTransaction(signedTransaction, profile.url);
    }
}
