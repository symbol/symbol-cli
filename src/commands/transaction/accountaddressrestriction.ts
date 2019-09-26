import { command, metadata, option } from 'clime';
import {
    Account,
    AccountRestrictionModification,
    AccountRestrictionModificationAction,
    AccountRestrictionTransaction,
    AccountRestrictionType,
    Address,
    Deadline,
    TransactionHttp,
    UInt64,
} from 'nem2-sdk';
import { OptionsResolver } from '../../options-resolver';
import { ProfileCommand, ProfileOptions } from '../../profile.command';
import { ModificationActionValidator } from '../../validators/modificationAction.validator';
import { RestrictionTypeValidator } from '../../validators/restrictionType.validator';

export class CommandOptions extends ProfileOptions {
    @option({
        flag: 'p',
        description: '(Optional) Select between your profiles, by providing a profile (blank means default profile)',
    })
    profile: string;

    @option({
        flag: 't',
        description: 'restriction type (allow / block)',
        validator: new RestrictionTypeValidator(),
    })
    restrictionType: string;

    @option({
        flag: 'd',
        description: '(Optional) incoming/outgoing (blank means incoming)',
    })
    restrictionDirection: string;

    @option({
        flag: 'a',
        description: 'Modification action. (1: Add, 0: Remove)',
        validator: new ModificationActionValidator(),
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
    description: 'Allow or block incoming and outgoing transactions for a given a set of addresses.',
})
export default class extends ProfileCommand {
    constructor() {
        super();
    }

    @metadata
    execute(options: CommandOptions) {
        options.restrictionType = OptionsResolver(options,
            'restrictionType',
            () => undefined,
            'Fill in the restriction type (allow / block): ');

        options.modificationAction = OptionsResolver(options,
            'modificationAction',
            () => undefined,
            'Fill in the modification action (1: Add, 0: Remove): ');

        options.restrictionDirection = OptionsResolver(options,
            'restrictionDirection',
            () => undefined,
            'Fill in the restriction direction (incoming / outgoing): ');

        options.value = OptionsResolver(options,
            'value',
            () => undefined,
            'Fill in the Address: ');

        let modificationAction;
        if ('1' === options.modificationAction) {
            modificationAction = AccountRestrictionModificationAction.Add;
        } else if ('0' === options.modificationAction) {
            modificationAction = AccountRestrictionModificationAction.Remove;
        } else {
            console.log('Wrong modificationAction. ModificationAction must be one of 1 or 0');
            return;
        }

        let restrictionType;
        if ('allow' === options.restrictionType.toLowerCase()) {
            if ('outgoing' === options.restrictionDirection.toLowerCase()) {
                restrictionType = AccountRestrictionType.AllowOutgoingAddress;
            } else {
                restrictionType = AccountRestrictionType.AllowIncomingAddress;
            }
        } else if ('block' === options.restrictionType.toLowerCase()) {
            if ('outgoing' === options.restrictionDirection.toLowerCase()) {
                restrictionType = AccountRestrictionType.BlockOutgoingAddress;
            } else {
                restrictionType = AccountRestrictionType.BlockIncomingAddress;
            }
        } else {
            console.log('Wrong restrictionType. restrictionType must be one of \'allow\' or \'block\'');
            return;
        }

        const profile = this.getProfile(options);
        const address = Address.createFromRawAddress(options.value);

        const addressRestriction = AccountRestrictionModification.createForAddress(modificationAction, address);
        const transaction = AccountRestrictionTransaction.createAddressRestrictionModificationTransaction(
            Deadline.create(),
            restrictionType,
            [addressRestriction],
            profile.networkType,
            UInt64.fromUint(options.maxfee),
        );
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
