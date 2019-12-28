import {ExpectedError, ValidationContext, Validator} from 'clime';
import {HashType} from 'nem2-sdk';

/**
 * Hash algorithm validator
 */
export class HashAlgorithmValidator implements Validator<number> {

    /**
     * Validates if the hash algorithm is available.
     * @param {string} value - Hash algorithm code.
     * @param {ValidationContext} context
     * @throws {ExpectedError}
     */
    validate(value: number, context?: ValidationContext): void {
        if (!(value in HashType)) {
            throw new ExpectedError('hashAlgorithm must be one of ' +
                '(0: Op_Sha3_256, 1: Op_Keccak_256, 2: Op_Hash_160, 3: Op_Hash_256)');
        }
    }
}
