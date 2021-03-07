import { IntegerStringValidator } from './integer.validator';
import { Validator } from './validator';

/**
 * Deadline validator
 */
export class DeadlineValidator implements Validator<string> {
    /**
     * Validates if deadline(ms) is a non-negative integer.
     * @param {string} value - number.
     * @returns {true | string}
     */
    validate(value: string): boolean | string {
        if (new IntegerStringValidator().validate(value) === true && Number.parseInt(value) > -1) {
            return true;
        } else {
            return 'Deadline(ms) should be a non-negative integer';
        }
    }
}
