import {UInt64} from 'symbol-sdk'
import {ProfileOptions} from '../interfaces/profile.command'
import {ProfileModel} from '../models/profile.model'
import {OptionsResolver} from '../options-resolver'
import {NumericStringValidator} from '../validators/numericString.validator'
import {Resolver} from './resolver'

/**
 * Amount resolver
 */
export class AmountResolver implements Resolver {

    /**
     * Resolves an absolute amount by the user.
     * @param {ProfileOptions} options - Command options.
     * @param {ProfileModel} secondSource - Secondary data source.
     * @param {string} altText - Alternative text.
     * @param {string} altKey - Alternative key.
     * @returns {Promise<UInt64>}
     */
    async resolve(options: ProfileOptions, secondSource?: ProfileModel, altText?: string, altKey?: string): Promise<UInt64> {
        const resolution = await OptionsResolver(options,
            altKey ? altKey : 'amount',
            () =>  undefined,
            altText ? altText : 'Enter an absolute amount:',
            'text',
            new NumericStringValidator())
        return UInt64.fromNumericString(resolution)
    }
}
