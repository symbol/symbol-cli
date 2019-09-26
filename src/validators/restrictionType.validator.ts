import {ExpectedError, ValidationContext, Validator} from 'clime';

export class RestrictionTypeValidator implements Validator<string> {
    validate(value: string, context: ValidationContext): void {
        if (!('allow' === value || 'block' === value)) {
            throw new ExpectedError('restrictionType must be one of \'allow\' or \'block\'');
        }
    }
}
