import {OptionsChoiceResolver} from '../options-resolver'
import {HashAlgorithmValidator} from '../validators/hashAlgorithm.validator'
import {Resolver} from './resolver'
import {LockHashAlgorithm} from 'symbol-sdk'
import {Options} from 'clime'

/**
 * Link hashAlgorithm resolver
 */
export class HashAlgorithmResolver implements Resolver {

    /**
     * Resolves an hashAlgorithm provided by the user.
     * @param {Options} options - Command options.
     * @param {string} altText - Alternative text.
     * @param {string} altKey - Alternative key.
     * @returns {Promise<number>}
     */
    async resolve(options: Options, altText?: string, altKey?: string): Promise<number> {
        const choices = Object
            .keys(LockHashAlgorithm)
            .filter((key) => Number.isNaN(parseFloat(key)))
            .map((string) => ({
                title: string,
                value: LockHashAlgorithm[string as any],
            }))

        const value = +(await OptionsChoiceResolver(options,
            altKey ? altKey : 'hashAlgorithm',
            altText ? altText : 'Select the algorithm used to hash the proof:',
            choices,
            'select',
            new HashAlgorithmValidator()))
        return value
    }
}
