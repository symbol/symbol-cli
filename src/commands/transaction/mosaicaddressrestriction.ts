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
import {OptionsResolver} from '../../options-resolver';
import {ProfileCommand, ProfileOptions} from '../../profile.command';
import {MosaicRestrictionType} from '../../validators/mosaic.validator';

export class CommandOptions extends ProfileOptions {
    public static limitType = [0, 1, 2, 3, 4, 5, 6];

    @option({
        flag: 'p',
        description: '(Optional) Select between your profiles, by providing a profile',
    })
    profile: string;

    @option({
        flag: 'f',
        default: 0,
        description: '(Optional) Maximum fee',
    })
    maxFee: number;

    @option({
        flag: 'i',
        description: 'Identifier of the mosaic being restricted',
    })
    mosaicid: string;

    @option({
        flag: 'a',
        description: 'Address being restricted',
    })
    targetAddress: string;

    @option({
        flag: 'k',
        description: 'Restriction key relative to the reference mosaic identifier',
    })
    restrictionKey: string;

    @option({
        flag: 'v',
        default: '0',
        description: '(Optional) Previous restriction value.',
    })
    previousRestrictionValue: string;

    @option({
        flag: 'V',
        description: 'New restriction value',
    })
    newRestrictionValue: string;

    @option({
        flag: 'T',
        description: 'New restriction type',
        validator: new MosaicRestrictionType(),
    })
    newRestrictionType: number;
}

@command({
    description: 'Set a mosaic restriction to an specific address.',
})
export default class extends ProfileCommand {
    constructor() {
        super();
    }
    @metadata
    execute(options: CommandOptions) {
        options.mosaicid = OptionsResolver(
            options,
            'mosaicid',
            () => undefined,
            'The identifier of the mosaic being restricted: ',
        );

        options.targetAddress = OptionsResolver(
            options,
            'targetAddress',
            () => undefined,
            'The address being restricted: ',
        );

        options.restrictionKey = OptionsResolver(
            options,
            'restrictionkey',
            () => undefined,
            'Restriction key relative to the reference mosaic identifier: ',
        );

        options.newRestrictionValue = OptionsResolver(
            options,
            'newRestrictionValue',
            () => undefined,
            'Restriction newRestrictionValue: ',
        );

        options.newRestrictionType = parseInt(OptionsResolver(
            options,
            'newRestrictionType',
            () => undefined,
            'Restriction newRestrictionType: ',
        ), 10);

        if (!CommandOptions.limitType.includes(options.newRestrictionType)) {
            throw new ExpectedError('Wrong mosaic restriction type');
        }

        console.log(options);
        const profile = this.getProfile(options);

        const addressRestrictionTransaction = MosaicAddressRestrictionTransaction.create(
            Deadline.create(),
            new MosaicId(options.mosaicid),
            UInt64.fromNumericString(options.restrictionKey),
            Address.createFromRawAddress(options.targetAddress),
            UInt64.fromNumericString(options.newRestrictionValue),
            profile.networkType,
            options.previousRestrictionValue ? UInt64.fromNumericString(options.previousRestrictionValue) : undefined,
            UInt64.fromUint(options.maxFee),
        );

        const account = Account.createFromPrivateKey(profile.account.privateKey, profile.networkType);
        const networkGenerationHash = profile.networkGenerationHash;

        const signedTransaction = account.sign(addressRestrictionTransaction, networkGenerationHash);
        console.log(chalk.green('signed transaction hash: \n'));
        console.log(signedTransaction.hash + '\n');

        const transactionHttp = new TransactionHttp(profile.url);
        transactionHttp
            .announce(signedTransaction)
            .subscribe(
                (x: any) => console.log(x),
                (err: any) => console.error(err));
    }
}
