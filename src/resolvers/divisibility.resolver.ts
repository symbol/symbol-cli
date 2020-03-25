import {OptionsResolver} from '../options-resolver'
import {NumericStringValidator} from '../validators/numericString.validator'
import {Resolver} from './resolver'
import {Options} from 'clime'

/**
 * Divisibility resolver
 */
export class DivisibilityResolver implements Resolver {

    /**
     * Resolves a divisibility provided by the user.
     * @param {Options} options - Command options.
     * @param {string} altText - Alternative text.
     * @param {string} altKey - Alternative key.
     * @returns {Promise<number>}
     */
    async resolve(options: Options, altText?: string, altKey?: string): Promise<number> {
        const resolution = +(await OptionsResolver(options,
            altKey ? altKey : 'divisibility',
            () =>  undefined,
            altText ? altText : 'Enter the mosaic divisibility:',
            'text',
            undefined))
        return resolution
    }
}
