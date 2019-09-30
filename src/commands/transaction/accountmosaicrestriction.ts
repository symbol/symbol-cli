import { command, metadata, option } from 'clime';
import {
    AccountRestrictionModification,
    AccountRestrictionTransaction,
    AccountRestrictionType,
    Deadline,
    MosaicId,
    UInt64,
} from 'nem2-sdk';
import { AnnounceTransactionsCommand, AnnounceTransactionsOptions } from '../../announce.transactions.command';
import { OptionsResolver } from '../../options-resolver';
import { BinaryValidator } from '../../validators/binary.validator';
import { RestrictionTypeValidator } from '../../validators/restrictionType.validator';

export class CommandOptions extends AnnounceTransactionsOptions {
    @option({
        flag: 'p',
        description: '(Optional) Select between your profiles, by providing a profile (blank means default profile).',
    })
    profile: string;

    @option({
        flag: 't',
        description: 'restriction type (allow / block).',
        validator: new RestrictionTypeValidator(),
    })
    restrictionType: string;

    @option({
        flag: 'a',
        description: 'Modification action (1: Add, 0: Remove).',
        validator: new BinaryValidator(),
    })
    modificationAction: number;

    @option({
        flag: 'v',
        description: 'Address to allow / block.',
    })
    value: string;

    @option({
        flag: 'f',
        description: '(Optional) Maximum fee',
    })
    maxfee: number;
}

@command({
    description: 'Allow or block incoming transactions containing a given set of mosaics.',
})
export default class extends AnnounceTransactionsCommand {
    constructor() {
        super();
    }

    @metadata
    execute(options: CommandOptions) {
        options.restrictionType = OptionsResolver(options,
            'restrictionType',
            () => undefined,
            'Fill in the restriction type (allow / block): ');

        options.modificationAction = parseInt(OptionsResolver(options,
            'modificationAction',
            () => undefined,
            'Fill in the modification action (1: Add, 0: Remove): '), 10);

        options.value = OptionsResolver(options,
            'value',
            () => undefined,
            'Fill in the Address: ');

        let restrictionType;
        if ('allow' === options.restrictionType.toLowerCase()) {
            restrictionType = AccountRestrictionType.AllowMosaic;
        } else if ('block' === options.restrictionType.toLowerCase()) {
            restrictionType = AccountRestrictionType.BlockMosaic;
        } else {
            console.log('Wrong restrictionType. restrictionType must be one of \'allow\' or \'block\'');
            return;
        }

        const profile = this.getProfile(options);
        const mosaic = new MosaicId(options.value);

        const mosaicRestriction = AccountRestrictionModification.createForMosaic(options.modificationAction, mosaic);
        const transaction = AccountRestrictionTransaction.createMosaicRestrictionModificationTransaction(
            Deadline.create(),
            restrictionType,
            [mosaicRestriction],
            profile.networkType,
            UInt64.fromUint(options.maxfee));

        const signedTransaction = profile.account.sign(transaction, profile.networkGenerationHash);
        this.announceTransaction(signedTransaction, profile.url);
    }
}
