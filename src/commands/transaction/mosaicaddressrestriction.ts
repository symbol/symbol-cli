import chalk from 'chalk';
import { command, metadata, option } from 'clime';
import {
    Deadline,
    MosaicAddressRestrictionTransaction,
    UInt64,
} from 'nem2-sdk';
import { AnnounceTransactionsCommand, AnnounceTransactionsOptions } from '../../announce.transactions.command';
import { TargetAddressResolver } from '../../resolvers/address.resolver';
import { DurationResolver } from '../../resolvers/duration.resolver';
import { MosaicIdAliasResolver } from '../../resolvers/mosaic.resolver';
import { RestrictionTypeResolver } from '../../resolvers/restrictionType.resolver';
import { MosaicRestrictionTypeValidator } from '../../validators/mosaic.validator';
import { NumericStringValidator } from '../../validators/numericString.validator';

export class CommandOptions extends AnnounceTransactionsOptions {
    @option({
        flag: 'i',
        description: 'Identifier of the mosaic being restricted.',
    })
    mosaicId: string;

    @option({
        flag: 'a',
        description: 'Address being restricted.',
    })
    targetAddress: string;

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
        flag: 'V',
        description: 'New restriction value.',
        validator: new NumericStringValidator(),
    })
    newRestrictionValue: string;

    @option({
        flag: 'T',
        description: 'New restriction type (NONE: no restriction, EQ: equal, NE: not equal, LT: less than, LE: less than or equal,' +
            'GT: greater than, GE: greater than or equal).',
        validator: new MosaicRestrictionTypeValidator(),
    })
    newRestrictionType: string;
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
        const restrictionKey = new DurationResolver().resolve(
            options,
            undefined,
            'Enter restriction key relative to the reference mosaic identifier: ');
        const newRestrictionValue = new DurationResolver().resolve(
            options,
            undefined,
            'Enter new restriction value: ');
        const newRestrictionType = new RestrictionTypeResolver().resolve(options);

        const mosaicAddressRestrictionTransaction = MosaicAddressRestrictionTransaction.create(
            Deadline.create(),
            mosaicId,
            restrictionKey,
            targetAddress,
            newRestrictionValue,
            profile.networkType,
            /[a-f|A-F]/.test(options.previousRestrictionValue) ?
                UInt64.fromHex(options.previousRestrictionValue) : UInt64.fromNumericString(options.previousRestrictionValue),
            UInt64.fromNumericString(options.maxFee),
        );

        const networkGenerationHash = profile.networkGenerationHash;
        const signedTransaction = account.sign(mosaicAddressRestrictionTransaction, networkGenerationHash);
        console.log(chalk.green('signed transaction hash: \n'));
        console.log(signedTransaction.hash + '\n');
        this.announceTransaction(signedTransaction, profile.url);
    }
}
