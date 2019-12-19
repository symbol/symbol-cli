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
import {command, ExpectedError, metadata, option} from 'clime';
import {AccountRestrictionTransaction, Deadline, Password, UInt64} from 'nem2-sdk';
import * as readlineSync from 'readline-sync';
import {AnnounceTransactionsCommand, AnnounceTransactionsOptions} from '../../announce.transactions.command';
import {OptionsResolver} from '../../options-resolver';
import {AccountService} from '../../service/account.service';
import {RestrictionService} from '../../service/restriction.service';
import {AddressAliasValidator} from '../../validators/address.validator';
import {BinaryValidator} from '../../validators/binary.validator';
import {PasswordValidator} from '../../validators/password.validator';
import {AccountRestrictionDirectionValidator, AccountRestrictionTypeValidator} from '../../validators/restrictionType.validator';

export class CommandOptions extends AnnounceTransactionsOptions {
    @option({
        flag: 't',
        description: 'Restriction flag (allow, block).',
        validator: new AccountRestrictionTypeValidator(),
    })
    restrictionFlag: string;

    @option({
        flag: 'd',
        description: 'Restriction direction (incoming, outgoing).',
        validator: new AccountRestrictionDirectionValidator(),
    })
    restrictionDirection: string;

    @option({
        flag: 'a',
        description: 'Modification action. (1: Add, 0: Remove).',
        validator: new BinaryValidator(),
    })
    modificationAction: number;

    @option({
        flag: 'v',
        description: 'Address or @alias to allow/block.',
        validator: new AddressAliasValidator(),
    })
    value: string;

    @option({
        flag: 'p',
        description: '(Optional) Account password',
        validator: new PasswordValidator(),
    })
    password: string;
}

@command({
    description: 'Allow or block incoming and outgoing transactions for a given a set of addresses',
})
export default class extends AnnounceTransactionsCommand {
    private readonly restrictionService: RestrictionService;
    constructor() {
        super();
        this.restrictionService = new RestrictionService();
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

        options.restrictionFlag = OptionsResolver(options,
            'restrictionFlag',
            () => undefined,
            'Introduce the restriction flag (allow, block):');

        options.modificationAction = +OptionsResolver(options,
            'modificationAction',
            () => undefined,
            'Introduce the modification action (1: Add, 0: Remove): ');

        options.restrictionDirection = OptionsResolver(options,
            'restrictionDirection',
            () => undefined,
            'Introduce the restriction direction (incoming, outgoing): ');

        options.value = OptionsResolver(options,
            'value',
            () => undefined,
            'Introduce the address: ');

        options.maxFee = OptionsResolver(options,
            'maxFee',
            () => undefined,
            'Introduce the maximum fee (absolute amount): ');

        const address = AccountService.getRecipient(options.value);

        const transaction = AccountRestrictionTransaction.createAddressRestrictionModificationTransaction(
            Deadline.create(),
            this.restrictionService.getAccountAddressRestrictionFlags(options.restrictionFlag, options.restrictionDirection),
            (options.modificationAction === 1) ? [address] : [],
            (options.modificationAction === 0) ? [address] : [],
            profile.networkType,
            options.maxFee ? UInt64.fromNumericString(options.maxFee) : UInt64.fromUint(0));

        const signedTransaction = account.sign(transaction, profile.networkGenerationHash);
        this.announceTransaction(signedTransaction, profile.url);
    }

}
