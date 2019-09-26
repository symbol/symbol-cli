import {ExpectedError, ValidationContext, Validator} from 'clime';

export class ModificationActionValidator implements Validator<string> {
    validate(value: string, context: ValidationContext): void {
        if (!('1' === value || '0' === value)) {
            throw new ExpectedError('restrictionDirection must be one of \'1(Add)\' or \'0(Remove)\'');
        }
    }
}
