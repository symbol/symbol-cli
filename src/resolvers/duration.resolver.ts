import {OptionsResolver} from '../options-resolver'
import {NumericStringValidator} from '../validators/numericString.validator'
import {Resolver} from './resolver'
import {UInt64} from 'symbol-sdk'
import {Options} from 'clime'

/**
 * Duration resolver
 */
export class DurationResolver implements Resolver {

    /**
     * Resolves a duration by the user.
     * @param {Options} options - Command options.
     * @param {string} altText - Alternative text.
     * @param {string} altKey - Alternative key.
     * @returns {Promise<UInt64>}
     */
    async resolve(options: Options, altText?: string, altKey?: string): Promise<UInt64> {
        const resolution = await OptionsResolver(options,
            altKey ? altKey : 'duration',
            () =>  undefined,
            altText ? altText : 'Enter the duration in number of blocks:',
            'text',
            new NumericStringValidator())
        return UInt64.fromNumericString(resolution)
    }
}
