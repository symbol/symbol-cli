import {ExpectedError, ValidationContext, Validator} from 'clime';

export class HashAlgorithmValidator implements Validator<number> {
    public static hashAlgorithm = [0, 1, 2, 3];
    validate(value: number, context: ValidationContext): void {
        if (!HashAlgorithmValidator.hashAlgorithm.includes(value)) {
            throw new ExpectedError('hashAlgorithm must be one of ' + HashAlgorithmValidator.hashAlgorithm);
        }
    }
}
