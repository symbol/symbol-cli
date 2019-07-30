import {ExpectedError, ValidationContext, Validator} from 'clime';

export class MaxfeeValidator implements Validator<string> {
    validate(value: string, context: ValidationContext): void {
        const  tag = /^\d+$/;
        if (!tag.test(value)) {
            throw new ExpectedError('maxFee must be greater than or equal to 0');
        }
    }
}
