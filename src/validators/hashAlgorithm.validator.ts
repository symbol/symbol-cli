import {ExpectedError, ValidationContext, Validator} from 'clime';
import {HashType} from 'nem2-sdk';

/**
 * Hash algorithm validator
 */
export class HashAlgorithmValidator implements Validator<string> {

    /**
     * Validates if the hash algorithm is available.
     * @param {string} value - Hash algorithm code.
     * @param {ValidationContext} context
     * @throws {ExpectedError}
     */
    validate(value: string, context?: ValidationContext): void {
        if (!(value in HashType)) {
            throw new ExpectedError('Hash algorithm must be one of ' +
                '(Op_Sha3_256, Op_Keccak_256, Op_Hash_160, Op_Hash_256)');
        }
    }
}
