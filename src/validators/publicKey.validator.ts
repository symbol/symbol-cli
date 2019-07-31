import {ExpectedError, ValidationContext, Validator} from 'clime';

export class PublicKeyValidator implements Validator<string> {
    validate(value: string, context: ValidationContext): void {
        if (value.length !== 64 || !/^[0-9a-fA-F]+$/.test(value)) {
            throw new ExpectedError('public key should be a 64 characters hexadecimal string');
        }
    }
}
