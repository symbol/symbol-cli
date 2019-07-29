import {ExpectedError, ValidationContext, Validator} from 'clime';

export class MaxfeeValidator implements Validator<string> {
    validate(value: string, context: ValidationContext): void {
        const  tag = /^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$/;
        if (!tag.test(value)) {
            throw new ExpectedError('maxFee must be greater than or equal to 0');
        }
    }
}
