import {ProfileOptions} from '../interfaces/profile.command'
import {Profile} from '../models/profile.model'
import {OptionsResolver} from '../options-resolver'
import {Resolver} from './resolver'

/**
 * String resolver
 */
export class StringResolver implements Resolver {

    /**
     * Resolves an string value provided by the user.
     * @param {ProfileOptions} options - Command options.
     * @param {Profile} secondSource - Secondary data source.
     * @param {string} altText - Alternative text.
     * @param {string} altKey - Alternative key.
     * @returns {Promise<string>}
     */
    async resolve(options: ProfileOptions, secondSource?: Profile, altText?: string, altKey?: string): Promise<string> {
        const resolution = await OptionsResolver(options,
            altKey ? altKey : 'value',
            () => undefined,
            altText ? altText : 'Enter a string value:',
            'text',
            undefined)
        return resolution
    }
}
