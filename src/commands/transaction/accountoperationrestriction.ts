import {command, metadata, option} from 'clime';
import {
    Account,
    AccountRestrictionModification,
    AccountRestrictionTransaction,
    Deadline,
    RestrictionModificationType,
    RestrictionType,
    TransactionHttp,
    TransactionType,
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
        description: 'Transaction Type (TRANSFER, REGISTER_NAMESPACE, ADDRESS_ALIAS, MOSAIC_ALIAS, ' +
        'MOSAIC_DEFINITION, MOSAIC_SUPPLY_CHANGE, MODIFY_MULTISIG_ACCOUNT, AGGREGATE_COMPLETE, AGGREGATE_BONDED, LOCK, SECRET_LOCK, ' +
        'SECRET_PROOF, MODIFY_ACCOUNT_PROPERTY_ADDRESS, MODIFY_ACCOUNT_PROPERTY_MOSAIC, MODIFY_ACCOUNT_PROPERTY_ENTITY_TYPE, LINK_ACCOUNT)',
    })
    value: string;

    @option({
        flag: 'f',
        description: '(Optional) Maximum fee',
    })
    maxfee: number;
}

@command({
    description: 'Allow or block outgoing transactions by transaction type.',
})
export default class extends ProfileCommand {
    constructor() {
        super();
    }

    @metadata
    execute(options: CommandOptions) {
        const transactionType = ['TRANSFER', 'REGISTER_NAMESPACE', 'ADDRESS_ALIAS', 'MOSAIC_ALIAS', 'MOSAIC_DEFINITION',
        'MOSAIC_SUPPLY_CHANGE', 'MODIFY_MULTISIG_ACCOUNT', 'AGGREGATE_COMPLETE', 'AGGREGATE_BONDED', 'LOCK', 'SECRET_LOCK',
        'SECRET_PROOF', 'MODIFY_ACCOUNT_RESTRICTION_ADDRESS', 'MODIFY_ACCOUNT_RESTRICTION_MOSAIC', 'MODIFY_ACCOUNT_RESTRICTION_OPERATION',
        'LINK_ACCOUNT', 'MOSAIC_ADDRESS_RESTRICTION', 'MOSAIC_GLOBAL_RESTRICTION'];
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

        if (!transactionType.includes(options.value)) {
            options.value = OptionsResolver(options,
                'value',
                () => undefined,
                'Fill in the transaction Type (' + transactionType + '): ');
        }

        let modificationAction;
        if ('1' === options.modificationAction) {
            modificationAction = RestrictionModificationType.Add;
        } else if ('0' === options.modificationAction) {
            modificationAction = RestrictionModificationType.Remove;
        } else {
            console.log('Wrong modificationAction. ModificationAction must be one of 1 or 0');
            return;
        }

        let restrictionType;
        if ('allow' === options.restrictionType.toLowerCase()) {
            restrictionType = RestrictionType.AllowTransaction;
        } else if ('block' === options.restrictionType.toLowerCase()) {
            restrictionType = RestrictionType.BlockTransaction;
        } else {
            console.log('Wrong restrictionType. restrictionType must be one of \'allow\' or \'block\'');
            return;
        }

        let transactionEntity;
        switch (options.value.toUpperCase()) {
            case 'TRANSFER': transactionEntity = TransactionType.TRANSFER; break;
            case 'REGISTER_NAMESPACE': transactionEntity = TransactionType.REGISTER_NAMESPACE; break;
            case 'ADDRESS_ALIAS': transactionEntity = TransactionType.ADDRESS_ALIAS; break;
            case 'MOSAIC_ALIAS': transactionEntity = TransactionType.MOSAIC_ALIAS; break;
            case 'MOSAIC_DEFINITION': transactionEntity = TransactionType.MOSAIC_DEFINITION; break;
            case 'MOSAIC_SUPPLY_CHANGE': transactionEntity= TransactionType.MOSAIC_SUPPLY_CHANGE; break;
            case 'MODIFY_MULTISIG_ACCOUNT': transactionEntity = TransactionType.MODIFY_MULTISIG_ACCOUNT; break;
            case 'AGGREGATE_COMPLETE': transactionEntity = TransactionType.AGGREGATE_COMPLETE; break;
            case 'AGGREGATE_BONDED': transactionEntity = TransactionType.AGGREGATE_BONDED; break;
            case 'LOCK': transactionEntity = TransactionType.LOCK; break;
            case 'SECRET_LOCK': transactionEntity = TransactionType.SECRET_LOCK; break;
            case 'SECRET_PROOF': transactionEntity = TransactionType.SECRET_PROOF; break;
            case 'MODIFY_ACCOUNT_RESTRICTION_ADDRESS': transactionEntity = TransactionType.MODIFY_ACCOUNT_RESTRICTION_ADDRESS; break;
            case 'MODIFY_ACCOUNT_RESTRICTION_MOSAIC': transactionEntity = TransactionType.MODIFY_ACCOUNT_RESTRICTION_MOSAIC; break;
            case 'MODIFY_ACCOUNT_RESTRICTION_OPERATION': transactionEntity = TransactionType.MODIFY_ACCOUNT_RESTRICTION_OPERATION; break;
            case 'LINK_ACCOUNT': transactionEntity = TransactionType.LINK_ACCOUNT; break;
            case 'MOSAIC_ADDRESS_RESTRICTION': transactionEntity = TransactionType.MOSAIC_ADDRESS_RESTRICTION; break;
            case 'MOSAIC_GLOBAL_RESTRICTION': transactionEntity = TransactionType.MOSAIC_GLOBAL_RESTRICTION; break;
            default: return console.log('Wrong transaction type. Transaction type must be one of ' + transactionType);
        }

        const profile = this.getProfile(options);
        const entityRestriction = AccountRestrictionModification.createForOperation(modificationAction, transactionEntity);
        const transaction = AccountRestrictionTransaction.createOperationRestrictionModificationTransaction(
            Deadline.create(),
            restrictionType,
            [entityRestriction],
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