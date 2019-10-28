import chalk from 'chalk';
import { command, ExpectedError, metadata, option} from 'clime';
import {
    Account,
    Address,
    Deadline,
    MosaicAddressRestrictionTransaction,
    MosaicId,
    TransactionHttp,
    UInt64,
} from 'nem2-sdk';
import {AnnounceTransactionsCommand, AnnounceTransactionsOptions} from '../../announce.transactions.command';
import {OptionsResolver} from '../../options-resolver';
import {MosaicRestrictionTypeValidator} from '../../validators/mosaic.validator';
import {NumericStringValidator} from '../../validators/numericString.validator';

export class CommandOptions extends AnnounceTransactionsOptions {
    public static limitType = ['NONE', 'EQ', 'NE', 'LT', 'LE', 'GT', 'GE'];

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
    description: 'Set a mosaic restriction to an specific address.',
})
export default class extends AnnounceTransactionsCommand {
    constructor() {
        super();
    }
    @metadata
    execute(options: CommandOptions) {
        options.mosaicId = OptionsResolver(
            options,
            'mosaicId',
            () => undefined,
            'Introduce mosaic identifier being restricted: ',
        );

        options.targetAddress = OptionsResolver(
            options,
            'targetAddress',
            () => undefined,
            'Introduce address being restricted: ',
        );

        options.restrictionKey = OptionsResolver(
            options,
            'restrictionkey',
            () => undefined,
            'Introduce restriction key relative to the reference mosaic identifier: ',
        );

        options.newRestrictionValue = OptionsResolver(
            options,
            'newRestrictionValue',
            () => undefined,
            'Introduce new restriction value: ',
        );

        options.newRestrictionType = OptionsResolver(
            options,
            'newRestrictionType',
            () => undefined,
            'Introduce new restriction type: (NONE: no restriction, EQ: equal, NE: not equal, LT: less than, LE: less than or equal,' +
            'GT: greater than, GE: greater than or equal).',
        );

        if (!CommandOptions.limitType.includes(options.newRestrictionType)) {
            throw new ExpectedError('Wrong mosaic restriction type.');
        }

        const profile = this.getProfile(options);

        const mosaicAddressRestrictionTransaction = MosaicAddressRestrictionTransaction.create(
            Deadline.create(),
            new MosaicId(options.mosaicId),
            UInt64.fromNumericString(options.restrictionKey),
            Address.createFromRawAddress(options.targetAddress),
            UInt64.fromNumericString(options.newRestrictionValue),
            profile.networkType,
            /[a-f|A-F]/.test(options.previousRestrictionValue) ?
                UInt64.fromHex(options.previousRestrictionValue) : UInt64.fromNumericString(options.previousRestrictionValue),
            UInt64.fromNumericString(options.maxFee),
        );

        const networkGenerationHash = profile.networkGenerationHash;
        const signedTransaction = profile.account.sign(mosaicAddressRestrictionTransaction, networkGenerationHash);
        console.log(chalk.green('signed transaction hash: \n'));
        console.log(signedTransaction.hash + '\n');
        this.announceTransaction(signedTransaction, profile.url);
    }
}
