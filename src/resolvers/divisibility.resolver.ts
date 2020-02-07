import {ProfileOptions} from '../interfaces/profile.command'
import {Profile} from '../models/profile'
import {OptionsResolver} from '../options-resolver'
import {Resolver} from './resolver'

/**
 * Divisibility resolver
 */
export class DivisibilityResolver implements Resolver {

    /**
     * Resolves a divisibility provided by the user.
     * @param {ProfileOptions} options - Command options.
     * @param {Profile} secondSource - Secondary data source.
     * @param {string} altText - Alternative text.
     * @param {string} altKey - Alternative key.
     * @returns {Promise<number>}
     */
    async resolve(options: ProfileOptions, secondSource?: Profile, altText?: string, altKey?: string): Promise<number> {
        const resolution = +(await OptionsResolver(options,
            altKey ? altKey : 'divisibility',
            () =>  undefined,
            altText ? altText : 'Enter the mosaic divisibility: '))
        return resolution
    }
}
