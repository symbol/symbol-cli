import { ExpectedError, ValidationContext, Validator } from 'clime';

export class AccountRestrictionDirectionValidator implements Validator<string> {
    validate(value: string, context: ValidationContext): void {
        value = value.toLowerCase();
        if ('incoming' !== value && 'outgoing' !== value) {
            throw new ExpectedError('restrictionDirection must be one of \'incomling\' or \'outgoing\'');
        }
    }
}

export class OperationRestrictionTypeValidator implements Validator<string> {
    private transactionType = ['RESERVED', 'TRANSFER', 'REGISTER_NAMESPACE', 'ADDRESS_ALIAS', 'MOSAIC_ALIAS', 'MOSAIC_DEFINITION',
        'MOSAIC_SUPPLY_CHANGE', 'MODIFY_MULTISIG_ACCOUNT', 'AGGREGATE_COMPLETE', 'AGGREGATE_BONDED', 'LOCK', 'SECRET_LOCK',
        'SECRET_PROOF', 'ACCOUNT_RESTRICTION_ADDRESS', 'ACCOUNT_RESTRICTION_MOSAIC',
        'ACCOUNT_RESTRICTION_OPERATION', 'LINK_ACCOUNT', 'MOSAIC_ADDRESS_RESTRICTION', 'MOSAIC_GLOBAL_RESTRICTION',
        'ACCOUNT_METADATA_TRANSACTION', 'MOSAIC_METADATA_TRANSACTION', 'NAMESPACE_METADATA_TRANSACTION'];

    validate(value: string, context: ValidationContext): void {
        value = value.toUpperCase();
        if (!this.transactionType.includes(value)) {
            throw new ExpectedError('Wrong transaction type. Transaction type must be one of ' + this.transactionType);
        }
    }
}

export class RestrictionTypeValidator implements Validator<string> {
    validate(value: string, context: ValidationContext): void {
        if (!('allow' === value || 'block' === value)) {
            throw new ExpectedError('restrictionType must be one of \'allow\' or \'block\'');
        }
    }
}

