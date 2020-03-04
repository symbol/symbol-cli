import {Validator} from './validator'
import {HashType} from 'symbol-sdk'

/**
 * Hash algorithm validator
 */
export class HashAlgorithmValidator implements Validator<string> {

    /**
     * Validates if the hash algorithm is available.
     * @param {string} value - Hash algorithm code.
     * @returns {true | string}
     */
    validate(value: string): boolean | string {
        return value in HashType ? true : 'Hash algorithm must be one of ' +
            '(Op_Sha3_256, Op_Keccak_256, Op_Hash_160, Op_Hash_256)'
    }
}
