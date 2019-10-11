import {command, metadata, option} from 'clime';
import {AccountRestrictionModification, AccountRestrictionTransaction, Address, Deadline, UInt64} from 'nem2-sdk';
import {AnnounceTransactionsCommand, AnnounceTransactionsOptions} from '../../announce.transactions.command';
import {OptionsResolver} from '../../options-resolver';
import {RestrictionService} from '../../service/restriction.service';
import {AddressValidator} from '../../validators/address.validator';
import {BinaryValidator} from '../../validators/binary.validator';
import {
    AccountRestrictionDirectionValidator,
    AccountRestrictionTypeValidator,
} from '../../validators/restrictionType.validator';

export class CommandOptions extends AnnounceTransactionsOptions {
    @option({
        flag: 't',
        description: 'Restriction type (allow, block).',
        validator: new AccountRestrictionTypeValidator(),
    })
    restrictionType: string;

    @option({
        flag: 'd',
        description: 'Restriction direction (incoming, outgoing).',
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
        validator: new AddressValidator(),
    })
    value: string;
}

@command({
    description: 'Allow or block incoming and outgoing transactions for a given a set of addresses.',
})
export default class extends AnnounceTransactionsCommand {
    private readonly restrictionService: RestrictionService;

    constructor() {
        super();
        this.restrictionService = new RestrictionService();
    }

    @metadata
    execute(options: CommandOptions) {
        options.restrictionType = OptionsResolver(options,
            'restrictionType',
            () => undefined,
            'Introduce the restriction type (allow, block):');

        options.modificationAction = OptionsResolver(options,
            'modificationAction',
            () => undefined,
            'Introduce the modification action (1: Add, 0: Remove): ');

        options.restrictionDirection = OptionsResolver(options,
            'restrictionDirection',
            () => undefined,
            'Introduce the restriction direction (incoming, outgoing): ');

        options.value = OptionsResolver(options,
            'value',
            () => undefined,
            'Introduce the address: ');

        const profile = this.getProfile(options);
        const address = Address.createFromRawAddress(options.value);

        const addressRestriction = AccountRestrictionModification.createForAddress(options.modificationAction, address);
        const transaction = AccountRestrictionTransaction.createAddressRestrictionModificationTransaction(
            Deadline.create(),
            this.restrictionService.getAccountAddressRestrictionType(options.restrictionType, options.restrictionDirection),
            [addressRestriction],
            profile.networkType,
            options.maxFee ? UInt64.fromNumericString(options.maxFee) : UInt64.fromUint(0));

        const signedTransaction = profile.account.sign(transaction, profile.networkGenerationHash);
        this.announceTransaction(signedTransaction, profile.url);
    }

}
