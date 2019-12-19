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
import {Deadline, MosaicId, MosaicSupplyChangeTransaction, Password, UInt64} from 'nem2-sdk';
import * as readlineSync from 'readline-sync';
import {AnnounceTransactionsCommand, AnnounceTransactionsOptions} from '../../announce.transactions.command';
import {OptionsResolver} from '../../options-resolver';
import {BinaryValidator} from '../../validators/binary.validator';
import {MosaicIdValidator} from '../../validators/mosaicId.validator';
import {NumericStringValidator} from '../../validators/numericString.validator';
import {PasswordValidator} from '../../validators/password.validator';

export class CommandOptions extends AnnounceTransactionsOptions {
    @option({
        flag: 'a',
        description: 'Mosaic supply change action (1: Increase, 0: Decrease).',
        validator: new BinaryValidator(),
    })
    action: number;

    @option({
        flag: 'm',
        description: 'Mosaic id in hexadecimal format.',
        validator: new MosaicIdValidator(),
    })
    mosaicId: string;

    @option({
        flag: 'd',
        description: 'Atomic amount of supply change.',
        validator: new NumericStringValidator(),
    })
    delta: string;

    @option({
        flag: 'p',
        description: '(Optional) Account password',
        validator: new PasswordValidator(),
    })
    password: string;
}

@command({
    description: 'Change a mosaic supply',
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

        options.mosaicId = OptionsResolver(options,
            'mosaicId',
            () => undefined,
            'Introduce mosaic in hexadecimal format: ');
        const mosaicId = new MosaicId(options.mosaicId);

        options.action = +OptionsResolver(options,
            'action',
            () => undefined,
            'Introduce supply change action (1: Increase, 0: Decrease): ');

        options.delta = OptionsResolver(options,
            'delta',
            () => undefined,
            'Introduce atomic amount of supply change: ');

        options.maxFee = OptionsResolver(options,
            'maxFee',
            () => undefined,
            'Introduce the maximum fee (absolute amount): ');

        const mosaicSupplyChangeTransaction = MosaicSupplyChangeTransaction.create(
            Deadline.create(),
            mosaicId,
            options.action,
            UInt64.fromNumericString(options.delta),
            profile.networkType,
            options.maxFee ? UInt64.fromNumericString(options.maxFee) : UInt64.fromUint(0));

        const signedTransaction = account.sign(mosaicSupplyChangeTransaction, profile.networkGenerationHash);
        this.announceTransaction(signedTransaction, profile.url);
    }
}
