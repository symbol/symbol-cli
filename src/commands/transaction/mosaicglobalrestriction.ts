import chalk from 'chalk';
import { command, ExpectedError, metadata, option} from 'clime';
import {
    Account,
    Deadline,
    MosaicGlobalRestrictionTransaction,
    MosaicId,
    TransactionHttp,
    UInt64,
} from 'nem2-sdk';
import {AnnounceTransactionsCommand, AnnounceTransactionsOptions} from '../../announce.transactions.command';
import {OptionsResolver} from '../../options-resolver';
import {MosaicService} from '../../service/restriction.service';
import {MosaicRestrictionTypeValidator} from '../../validators/mosaic.validator';

export class CommandOptions extends AnnounceTransactionsOptions {
    public static limitType = ['NONE', 'EQ', 'NE', 'LT', 'LE', 'GT', 'GE'];

    @option({
        flag: 'p',
        description: '(Optional) Select between your profiles, by providing a profile.',
    })
    profile: string;

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
    description: 'Set a global restriction to a mosaic.',
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
            'Introduce identifier of the mosaic being restricted: ',
        );

        options.restrictionKey = OptionsResolver(
            options,
            'restrictionKey',
            () => undefined,
            'Introduce restriction key relative to the reference mosaic identifier: ',
        );

        options.newRestrictionValue = OptionsResolver(
            options,
            'newRestrictionValue',
            () => undefined,
            'Introduce restriction new restriction value: ',
        );

        options.newRestrictionType = OptionsResolver(
            options,
            'newRestrictionType',
            () => undefined,
            'Introduce restriction new restriction type: (NONE: no restriction, EQ: equal, NE: not equal, LT: less than,' +
            'LE: less than or equal, GT: greater than, GE: greater than or equal)',
        );

        if (!CommandOptions.limitType.includes(options.newRestrictionType.toUpperCase())) {
            throw new ExpectedError('Wrong mosaic restriction type');
        }

        const profile = this.getProfile(options);

        const transaction = MosaicGlobalRestrictionTransaction.create(
            Deadline.create(),
            new MosaicId(options.mosaicId),
            UInt64.fromNumericString(options.restrictionKey),
            /[a-f|A-F]/.test(options.previousRestrictionValue) ?
                UInt64.fromHex(options.previousRestrictionValue) : UInt64.fromNumericString(options.previousRestrictionValue),
            MosaicService.getMosaicRestrictionType(options.previousRestrictionType),
            UInt64.fromNumericString(options.newRestrictionValue),
            MosaicService.getMosaicRestrictionType(options.newRestrictionType),
            profile.networkType,
            new MosaicId(options.referenceMosaicId),
            UInt64.fromUint(options.maxFee),
        );

        const networkGenerationHash = profile.networkGenerationHash;
        const signedTransaction = profile.account.sign(transaction, networkGenerationHash);
        console.log(chalk.green('signed transaction hash: \n'));
        console.log(signedTransaction.hash + '\n');

        this.announceTransaction(signedTransaction, profile.url);
    }
}
