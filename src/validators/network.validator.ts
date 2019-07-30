import {ExpectedError, ValidationContext, Validator} from 'clime';

export class NetworkValidator implements Validator<string> {
    validate(value: string, context: ValidationContext): void {
        if (!(value === 'MIJIN' || value === 'MIJIN_TEST' || value === 'MAIN_NET' || value === 'TEST_NET')) {
            throw new ExpectedError('it should be a valid network type');
        }
    }
}
