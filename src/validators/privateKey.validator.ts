import {ExpectedError, ValidationContext, Validator} from 'clime';

export class PrivateKeyValidator implements Validator<string> {
    validate(value: string, context: ValidationContext): void {
        if (value.length !== 64 || !/^[0-9a-fA-F]+$/.test(value)) {
            throw new ExpectedError('it private key should be a 64 characters hexadecimal string');
        }
    }
}
