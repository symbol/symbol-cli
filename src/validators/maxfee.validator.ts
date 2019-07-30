import {ExpectedError, ValidationContext, Validator} from 'clime';

export class MaxFeeValidator implements Validator<number> {
    validate(value: number, context: ValidationContext): void {
        if (!/^\d+$/.test(value.toString())) {
            throw new ExpectedError('maxFee should be greater than or equal to 0');
        }
    }
}
