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
import { command, metadata, option } from 'clime';
import {
    Deadline,
    SecretProofTransaction,
} from 'nem2-sdk';
import { AnnounceTransactionsCommand, AnnounceTransactionsOptions } from '../../announce.transactions.command';
import { OptionsResolver } from '../../options-resolver';
import { SecretLockService } from '../../service/secretlock.service';
import { HashAlgorithmValidator } from '../../validators/hashAlgorithm.Validator';

export class CommandOptions extends AnnounceTransactionsOptions {

    @option({
        description: 'Algorithm used to hash the proof(0: Op_Sha3_256, 1: Op_Keccak_256, 2: Op_Hash_160, 3: Op_Hash_256). ',
        flag: 'H',
        validator: new HashAlgorithmValidator(),
    })
    hashAlgorithm: number;

    @option({
        description: 'Proof hashed. ',
        flag: 's',
    })
    secret: string;

    @option({
        description: 'Original random set of bytes. ',
        flag: 'p',
    })
    proof: string;
}

@command({
    description: ' Creates a secretLock transaction ',
})
export default class extends AnnounceTransactionsCommand {
    constructor() {
        super();
    }

    @metadata
    execute(options: CommandOptions) {
        options.hashAlgorithm = OptionsResolver(options,
            'hashAlgorithm',
            () => undefined,
            'Introduce algorithm used to hash the proof(0: Op_Sha3_256, 1: Op_Keccak_256, 2: Op_Hash_160, 3: Op_Hash_256): ');
        options.secret = OptionsResolver(options,
            'secret',
            () => undefined,
            'Introduce proof hashed: ');
        options.proof = OptionsResolver(options,
            'proof',
            () => undefined,
            'Introduce original random set of bytes: ');

        const profile = this.getProfile(options);

        const secretLockService = new SecretLockService();
        const cryptoType = secretLockService.getCryptoType(options.hashAlgorithm);

        const secretProofTransaction = SecretProofTransaction.create(
            Deadline.create(),
            cryptoType,
            options.secret,
            profile.account.address,
            options.proof,
            profile.networkType,
        );

        const secretProofTransactionSigned = profile.account.sign(secretProofTransaction, profile.networkGenerationHash);
        this.announceTransaction(secretProofTransactionSigned, profile.url);
    }
}
