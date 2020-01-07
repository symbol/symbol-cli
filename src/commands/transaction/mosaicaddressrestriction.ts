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
import chalk from 'chalk';
import { command, metadata, option } from 'clime';
import {
    Deadline,
    MosaicAddressRestrictionTransaction,
    UInt64,
} from 'nem2-sdk';
import { AnnounceTransactionsCommand, AnnounceTransactionsOptions } from '../../announce.transactions.command';
import { TargetAddressResolver } from '../../resolvers/address.resolver';
import { MaxFeeResolver } from '../../resolvers/maxFee.resolver';
import { MosaicIdAliasResolver } from '../../resolvers/mosaic.resolver';
import { RestrictionKeyResolver } from '../../resolvers/restrictionKey.resolver';
import { RestrictionValueResolver } from '../../resolvers/restrictionValue.resolver';
import { AddressAliasValidator } from '../../validators/address.validator';
import { MosaicIdAliasValidator } from '../../validators/mosaicId.validator';
import { NumericStringValidator } from '../../validators/numericString.validator';
import { MosaicRestrictionKeyValidator } from '../../validators/restrictionKey.validator';

export class CommandOptions extends AnnounceTransactionsOptions {
    @option({
        flag: 'm',
        description: 'Mosaic identifier or @alias being restricted.',
        validator: new MosaicIdAliasValidator(),
    })
    mosaicId: string;

    @option({
        flag: 'a',
        description: 'Address or @alias being restricted.',
        validator: new AddressAliasValidator(),
    })
    targetAddress: string;

    @option({
        flag: 'k',
        description: 'Restriction key.',
        validator: new MosaicRestrictionKeyValidator(),
    })
    restrictionKey: string;

    @option({
        flag: 'v',
        description: '(Optional) Previous restriction value.',
    })
    previousRestrictionValue?: string;

    @option({
        flag: 'V',
        description: 'New restriction value.',
        validator: new NumericStringValidator(),
    })
    newRestrictionValue: string;
}

@command({
    description: 'Set a mosaic restriction to an specific address',
})
export default class extends AnnounceTransactionsCommand {
    constructor() {
        super();
    }
    @metadata
    execute(options: CommandOptions) {
        const profile = this.getProfile(options);
        const account = profile.decrypt(options);
        const mosaicId = new MosaicIdAliasResolver().resolve(options);
        const targetAddress = new TargetAddressResolver().resolve(options);
        const restrictionKey = new RestrictionKeyResolver().resolve(options);
        const newRestrictionValue = new RestrictionValueResolver().resolve(options);
        const maxFee = new MaxFeeResolver().resolve(options);
        let previousRestrictionValue: UInt64 | undefined;
        if (!options.previousRestrictionValue || '' === options.previousRestrictionValue) {
            previousRestrictionValue = undefined;
        } else {
            previousRestrictionValue = UInt64.fromNumericString(options.previousRestrictionValue);
        }
        const mosaicAddressRestrictionTransaction = MosaicAddressRestrictionTransaction.create(
            Deadline.create(),
            mosaicId,
            restrictionKey,
            targetAddress,
            newRestrictionValue,
            profile.networkType,
            previousRestrictionValue,
            maxFee,
        );

        const networkGenerationHash = profile.networkGenerationHash;
        const signedTransaction = account.sign(mosaicAddressRestrictionTransaction, networkGenerationHash);
        this.announceTransaction(signedTransaction, profile.url);
    }
}
