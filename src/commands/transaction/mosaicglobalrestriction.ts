import chalk from 'chalk';
import { command, ExpectedError, metadata, option} from 'clime';
import {
    Account,
    Deadline,
    MosaicGlobalRestrictionTransaction,
    MosaicId,
    UInt64,
} from 'nem2-sdk';
import {OptionsResolver} from '../../options-resolver';
import {ProfileCommand, ProfileOptions} from '../../profile.command';
import {MosaicService} from '../../service/restriction.service';
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
    maxfee: number;

    @option({
        flag: 'i',
        description: 'Identifier of the mosaic being restricted',
    })
    mosaicid: string;

    @option({
        flag: 'r',
        default: '0',
        description: '(Optional) Identifier of the mosaic providing the restriction key',
    })
    referencemosaicid: string;

    @option({
        flag: 'k',
        description: 'Restriction key relative to the reference mosaic identifier',
    })
    restrictionkey: string;

    @option({
        flag: 'v',
        default: '0',
        description: '(Optional) Previous restriction value.',
    })
    previousrestrictionvalue: string;

    @option({
        flag: 't',
        default: 0,
        description: '(Optional) Previous restriction type',
        validator: new MosaicRestrictionType(),
    })
    previousrestrictiontype: number;

    @option({
        flag: 'V',
        description: 'New restriction value',
    })
    newrestrictionvalue: string;

    @option({
        flag: 'T',
        description: 'New restriction type',
        validator: new MosaicRestrictionType(),
    })
    newrestrictiontype: number;
}

@command({
    description: 'Set a global restriction to a mosaic.',
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

        options.restrictionkey = OptionsResolver(
            options,
            'restrictionkey',
            () => undefined,
            'Restriction key relative to the reference mosaic identifier: ',
        );

        options.newrestrictionvalue = OptionsResolver(
            options,
            'newrestrictionvalue',
            () => undefined,
            'Restriction newrestrictionvalue: ',
        );

        options.newrestrictiontype = parseInt(OptionsResolver(
            options,
            'newrestrictiontype',
            () => undefined,
            'Restriction newrestrictiontype: ',
        ), 10);

        if (!CommandOptions.limitType.includes(options.newrestrictiontype)) {
            throw new ExpectedError('Wrong mosaic restriction type');
        }

        const profile = this.getProfile(options);

        const transaction = MosaicGlobalRestrictionTransaction.create(
            Deadline.create(),
            new MosaicId(options.mosaicid),
            UInt64.fromNumericString(options.restrictionkey),
            UInt64.fromNumericString(options.previousrestrictionvalue),
            MosaicService.getMosaicRestrictionType(options.previousrestrictiontype),
            UInt64.fromNumericString(options.newrestrictionvalue),
            MosaicService.getMosaicRestrictionType(options.newrestrictiontype),
            profile.networkType,
            new MosaicId(options.referencemosaicid),
            UInt64.fromUint(options.maxfee),
        );

        const account = Account.createFromPrivateKey(profile.account.privateKey, profile.networkType);
        const networkGenerationHash = profile.networkGenerationHash;
        const signedTransaction = account.sign(transaction, networkGenerationHash);
        console.log(chalk.green('signed transaction hash: \n'));
        console.log(signedTransaction.hash + '\n');
    }
}
