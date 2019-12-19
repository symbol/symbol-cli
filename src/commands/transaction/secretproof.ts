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
import {command, ExpectedError, metadata, option} from 'clime';
import {Deadline, Password, SecretProofTransaction, UInt64} from 'nem2-sdk';
import * as readlineSync from 'readline-sync';
import {AnnounceTransactionsCommand, AnnounceTransactionsOptions} from '../../announce.transactions.command';
import {OptionsResolver} from '../../options-resolver';
import {AccountService} from '../../service/account.service';
import {AddressAliasValidator} from '../../validators/address.validator';
import {HashAlgorithmValidator} from '../../validators/hashAlgorithm.validator';
import {PasswordValidator} from '../../validators/password.validator';

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
        description: 'Address or @alias that receives the funds once unlocked.',
        flag: 'r',
        validator: new AddressAliasValidator(),
    })
    recipientAddress: string;

    @option({
        flag: 'p',
        description: '(Optional) Account password',
        validator: new PasswordValidator(),
    })
    password: string;
}

@command({
    description: 'Announce a secret proof transaction',
})
export default class extends AnnounceTransactionsCommand {
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

        options.secret = OptionsResolver(options,
            'secret',
            () => undefined,
            'Introduce proof hashed in hexadecimal: ');

        options.proof = OptionsResolver(options,
            'proof',
            () => undefined,
            'Introduce original random set of bytes in hexadecimal: ');

        options.hashAlgorithm = +OptionsResolver(options,
            'hashAlgorithm',
            () => undefined,
            'Introduce algorithm used to hash the proof (0: Op_Sha3_256, 1: Op_Keccak_256, 2: Op_Hash_160, 3: Op_Hash_256): ');

        options.recipientAddress = OptionsResolver(options,
            'recipientAddress',
            () => undefined,
            'Introduce address that receives the funds once unlocked: ');

        options.maxFee = OptionsResolver(options,
            'maxFee',
            () => undefined,
            'Introduce the maximum fee (absolute amount): ');

        const recipientAddress = AccountService.getRecipient(options.recipientAddress);
        const secretProofTransaction = SecretProofTransaction.create(
            Deadline.create(),
            options.hashAlgorithm,
            options.secret,
            recipientAddress,
            options.proof,
            profile.networkType,
            options.maxFee ? UInt64.fromNumericString(options.maxFee) : UInt64.fromUint(0));
        const signedTransaction = account.sign(secretProofTransaction, profile.networkGenerationHash);

        this.announceTransaction(signedTransaction, profile.url);
    }
}
