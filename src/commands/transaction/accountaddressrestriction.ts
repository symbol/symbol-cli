import { command, metadata, option } from 'clime';
import {
    AccountRestrictionModification,
    AccountRestrictionTransaction,
    AccountRestrictionType,
    Address,
    Deadline,
    UInt64,
} from 'nem2-sdk';
import { AnnounceTransactionsCommand, AnnounceTransactionsOptions } from '../../announce.transactions.command';
import { OptionsResolver } from '../../options-resolver';
import { BinaryValidator } from '../../validators/binary.validator';
import { AccountRestrictionDirectionValidator, RestrictionTypeValidator } from '../../validators/modificationAction.validator';

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
        flag: 'd',
        description: '(Optional) incoming/outgoing (blank means incoming).',
        validator: new AccountRestrictionDirectionValidator(),
    })
    restrictionDirection: string;

    @option({
        flag: 'a',
        description: 'Modification action. (1: Add, 0: Remove).',
        validator: new BinaryValidator(),
    })
    modificationAction: number;

    @option({
        flag: 'v',
        description: 'Address to allow / block.',
    })
    value: string;
}

@command({
    description: 'Allow or block incoming and outgoing transactions for a given a set of addresses.',
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
            'Introduce the restriction type (allow/block):');

        options.modificationAction = parseInt(OptionsResolver(options,
            'modificationAction',
            () => undefined,
            'Introduce the modification action (1: Add, 0: Remove): '), 10);

        options.restrictionDirection = OptionsResolver(options,
            'restrictionDirection',
            () => undefined,
            'Introduce the restriction direction (incoming / outgoing): ');

        options.value = OptionsResolver(options,
            'value',
            () => undefined,
            'Introduce the Address: ');

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

        const addressRestriction = AccountRestrictionModification.createForAddress(options.modificationAction, address);
        const transaction = AccountRestrictionTransaction.createAddressRestrictionModificationTransaction(
            Deadline.create(),
            restrictionType,
            [addressRestriction],
            profile.networkType,
            UInt64.fromUint(options.maxFee),
        );
        const signedTransaction = profile.account.sign(transaction, profile.networkGenerationHash);
        this.announceTransaction(signedTransaction, profile.url);
    }
}
