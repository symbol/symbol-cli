import {Validator} from './validator'
import {LockHashAlgorithm} from 'symbol-sdk'

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
        return value in LockHashAlgorithm ? true : 'Hash algorithm must be one of (' +
            Object.keys(LockHashAlgorithm)
                .filter((key) => Number.isNaN(parseFloat(key))) + ').'
    }
}
