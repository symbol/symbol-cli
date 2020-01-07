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
import { Deadline, MosaicGlobalRestrictionTransaction, MosaicId, MosaicRestrictionType, UInt64 } from 'nem2-sdk';
import { AnnounceTransactionsCommand, AnnounceTransactionsOptions } from '../../announce.transactions.command';
import { MaxFeeResolver } from '../../resolvers/maxFee.resolver';
import { MosaicIdAliasResolver } from '../../resolvers/mosaic.resolver';
import { RestrictionKeyResolver } from '../../resolvers/restrictionKey.resolver';
import { RestrictionTypeResolver } from '../../resolvers/restrictionType.resolver';
import { RestrictionValueResolver } from '../../resolvers/restrictionValue.resolver';
import { MosaicIdAliasValidator } from '../../validators/mosaicId.validator';
import { NumericStringValidator } from '../../validators/numericString.validator';
import { MosaicRestrictionKeyValidator } from '../../validators/restrictionKey.validator';
import { MosaicRestrictionTypeValidator } from '../../validators/restrictionType.validator';

export class CommandOptions extends AnnounceTransactionsOptions {
    @option({
        flag: 'm',
        description: 'Mosaic identifier or @alias being restricted.',
        validator: new MosaicIdAliasValidator(),
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
        validator: new MosaicRestrictionKeyValidator(),
    })
    restrictionKey: string;

    @option({
        flag: 'v',
        default: '0',
        description: '(Optional) Previous restriction value.',
        validator: new NumericStringValidator(),
    })
    previousRestrictionValue: string;

    @option({
        flag: 't',
        default: 'NONE',
        description: '(Optional) Previous restriction type. (NONE: no restriction, EQ: equal, NE: not equal, LT: less than,' +
            'LE: less than or equal, GT: greater than, GE: greater than or equal)',
        validator: new MosaicRestrictionTypeValidator(),
    })
    previousRestrictionType: string;

    @option({
        flag: 'V',
        description: 'New restriction value.',
        validator: new NumericStringValidator(),
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
        const newRestrictionType = new RestrictionTypeResolver().resolve(options);
        const restrictionKey = new RestrictionKeyResolver().resolve(options);
        const newRestrictionValue = new RestrictionValueResolver().resolve(options);
        const maxFee = new MaxFeeResolver().resolve(options);

        const previousRestrictionType = Number(MosaicRestrictionType[options.previousRestrictionType as any]) as MosaicRestrictionType;
        const previousRestrictionValue = UInt64.fromNumericString(options.previousRestrictionValue);
        const referenceMosaicId = options.referenceMosaicId === '0' ? new MosaicId(options.referenceMosaicId) : undefined;

        const transaction = MosaicGlobalRestrictionTransaction.create(
            Deadline.create(),
            mosaicId,
            restrictionKey,
            previousRestrictionValue,
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
