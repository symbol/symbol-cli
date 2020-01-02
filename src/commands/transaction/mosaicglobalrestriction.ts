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

import { command, metadata, option } from 'clime';
import { Deadline, MosaicGlobalRestrictionTransaction, MosaicId, UInt64 } from 'nem2-sdk';
import { AnnounceTransactionsCommand, AnnounceTransactionsOptions } from '../../announce.transactions.command';
import { DurationResolver } from '../../resolvers/duration.resolver';
import { MaxFeeResolver } from '../../resolvers/maxFee.resolver';
import { MosaicIdAliasResolver } from '../../resolvers/mosaic.resolver';
import { PreviousRestrictionTypeResolver, RestrictionTypeResolver } from '../../resolvers/restrictionType.resolver';
import { NumericStringValidator } from '../../validators/numericString.validator';
import { MosaicRestrictionTypeValidator } from '../../validators/restrictionType.validator';

export class CommandOptions extends AnnounceTransactionsOptions {
    public static limitType = ['NONE', 'EQ', 'NE', 'LT', 'LE', 'GT', 'GE'];

    @option({
        flag: 'i',
        description: 'Identifier of the mosaic being restricted.',
    })
    mosaicId: string;

    @option({
        flag: 'r',
        default: '0',
        description: '(Optional) Identifier of the mosaic providing the restriction key.',
    })
    referenceMosaicId: string;

    @option({
        flag: 'k',
        description: 'Restriction key relative to the reference mosaic identifier.',
    })
    restrictionKey: string;

    @option({
        flag: 'v',
        default: 'FFFFFFFFFFFFFFFF',
        description: '(Optional) Previous restriction value.',
        validator: new NumericStringValidator(),
    })
    previousRestrictionValue: string;

    @option({
        flag: 't',
        default: 'NONE',
        description: 'Previous restriction type. (NONE: no restriction, EQ: equal, NE: not equal, LT: less than,' +
            'LE: less than or equal, GT: greater than, GE: greater than or equal)',
        validator: new MosaicRestrictionTypeValidator(),
    })
    previousRestrictionType: string;

    @option({
        flag: 'V',
        description: 'New restriction value.',
    })
    newRestrictionValue: string;

    @option({
        flag: 'T',
        description: 'New restriction type.',
        validator: new MosaicRestrictionTypeValidator(),
    })
    newRestrictionType: string;
}

@command({
    description: 'Set a global restriction to a mosaic',
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
        const restrictionKey = new DurationResolver().resolve(
            options,
            undefined,
            'Enter restriction key relative to the reference mosaic identifier: ');
        const newRestrictionValue = new DurationResolver().resolve(
            options,
            undefined,
            'Enter restriction new restriction value: ',
        );
        const newRestrictionType = new RestrictionTypeResolver().resolve(options);
        const previousRestrictionType = new PreviousRestrictionTypeResolver().resolve(options);
        const referenceMosaicId = new MosaicIdAliasResolver().resolve(options);
        const maxFee = new MaxFeeResolver().resolve(options);

        const transaction = MosaicGlobalRestrictionTransaction.create(
            Deadline.create(),
            mosaicId,
            restrictionKey,
            /[a-f|A-F]/.test(options.previousRestrictionValue) ?
                UInt64.fromHex(options.previousRestrictionValue) : UInt64.fromNumericString(options.previousRestrictionValue),
            previousRestrictionType,
            newRestrictionValue,
            newRestrictionType,
            profile.networkType,
            referenceMosaicId,
            maxFee,
        );

        const networkGenerationHash = profile.networkGenerationHash;
        const signedTransaction = account.sign(transaction, networkGenerationHash);
        this.announceTransaction(signedTransaction, profile.url);
    }
}
