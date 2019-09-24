import {command, metadata, option} from 'clime';
import {
    Account,
    AccountPropertyModification,
    AccountPropertyTransaction,
    Deadline,
    MosaicId,
    PropertyModificationType,
    PropertyType,
    TransactionHttp,
    UInt64,
} from 'nem2-sdk';
import {OptionsResolver} from '../../options-resolver';
import {ProfileCommand, ProfileOptions} from '../../profile.command';

export class CommandOptions extends ProfileOptions {
    @option({
        flag: 'p',
        description: '(Optional) Select between your profiles, by providing a profile (blank means default profile)',
    })
    profile: string;

    @option({
        flag: 't',
        description: 'restriction type (allow / block)',
    })
    restrictionType: string;

    @option({
        flag: 'a',
        description: 'Modification action. (1: Add, 0: Remove)',
    })
    modificationAction: string;

    @option({
        flag: 'v',
        description: 'Address to allow/block',
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
export default class extends ProfileCommand {
    constructor() {
        super();
    }

    @metadata
    execute(options: CommandOptions) {
        if (!['allow', 'block'].includes(options.restrictionType)) {
            options.restrictionType = OptionsResolver(options,
                'restrictionType',
                () => undefined,
                'Fill in the restriction type (allow / block): ');
        }

        if (!['1', '0'].includes(options.modificationAction)) {
            options.modificationAction = OptionsResolver(options,
                'modificationAction',
                () => undefined,
                'Fill in the modification action (1: Add, 0: Remove): ');
        }

        options.value = OptionsResolver(options,
            'value',
            () => undefined,
            'Fill in the Address: ');

        let modificationAction;
        if ('1' === options.modificationAction) {
            modificationAction = PropertyModificationType.Add;
        } else if ('0' === options.modificationAction) {
            modificationAction = PropertyModificationType.Remove;
        } else {
            console.log('Wrong modificationAction. ModificationAction must be one of 1 or 0');
            return;
        }

        let restrictionType;
        if ('allow' === options.restrictionType.toLowerCase()) {
            restrictionType = PropertyType.AllowMosaic;
        } else if ('block' === options.restrictionType.toLowerCase()) {
            restrictionType = PropertyType.BlockMosaic;
        } else {
            console.log('Wrong restrictionType. restrictionType must be one of \'allow\' or \'block\'');
            return;
        }

        const profile = this.getProfile(options);
        const mosaic = new MosaicId(options.value);

        const mosaicRestriction = AccountPropertyModification.createForMosaic(modificationAction, mosaic);
        const transaction = AccountPropertyTransaction.createMosaicPropertyModificationTransaction(
            Deadline.create(),
            restrictionType,
            [mosaicRestriction],
            profile.networkType,
            UInt64.fromUint(options.maxfee));

        const account = Account.createFromPrivateKey(profile.account.privateKey, profile.networkType);
        const signedTransaction = account.sign(transaction, profile.networkGenerationHash);
        const transactionHttp = new TransactionHttp(profile.url);
        transactionHttp
                .announce(signedTransaction)
                .subscribe(
                    (x) => console.log(x),
                    (err) => console.error(err));
    }
}
