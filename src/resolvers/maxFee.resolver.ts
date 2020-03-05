import {UInt64} from 'symbol-sdk'
import {ProfileOptions} from '../interfaces/profile.command'
import {ProfileModel} from '../models/profile.model'
import {OptionsResolver} from '../options-resolver'
import {Resolver} from './resolver'

/**
 * Max fee resolver
 */
export class MaxFeeResolver implements Resolver {

    /**
     * Resolves a max fee provided by the user.
     * @param {ProfileOptions} options - Command options.
     * @param {ProfileModel} secondSource - Secondary data source.
     * @param {string} altText - Alternative text.
     * @param {string} altKey - Alternative key.
     * @returns {Promise<UInt64>}
     */
    async resolve(options: ProfileOptions, secondSource?: ProfileModel, altText?: string, altKey?: string): Promise<UInt64> {
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
