import {OptionsResolver} from '../options-resolver'
import {Resolver} from './resolver'
import {UInt64} from 'symbol-sdk'
import {Options} from 'clime'

/**
 * Max fee resolver
 */
export class MaxFeeResolver implements Resolver {

    /**
     * Resolves a max fee provided by the user.
     * @param {Options} options - Command options.
     * @param {string} altText - Alternative text.
     * @param {string} altKey - Alternative key.
     * @returns {Promise<UInt64>}
     */
    async resolve(options: Options, altText?: string, altKey?: string): Promise<UInt64> {
        const resolution = await OptionsResolver(options,
            altKey ? altKey : 'maxFee',
            () => undefined,
            altText ? altText : 'Enter the maximum fee (absolute amount):',
            'text',
            undefined)
        try {
           return UInt64.fromNumericString(resolution)
        } catch {
           return UInt64.fromUint(0)
        }
    }
}
