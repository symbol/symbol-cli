import {ProfileOptions} from '../interfaces/profile.command'
import {ProfileModel} from '../models/profile.model'
import {OptionsResolver} from '../options-resolver'
import {Resolver} from './resolver'

/**
 * URL resolver
 */
export class URLResolver implements Resolver {

    /**
     * Resolves an url provided by the user.
     * @param {ProfileOptions} options - Command options.
     * @param {ProfileModel} secondSource - Secondary data source.
     * @param {string} altText - Alternative text.
     * @param {string} altKey - Alternative key.
     * @returns {Promise<string>}
     */
    async resolve(options: ProfileOptions, secondSource?: ProfileModel, altText?: string, altKey?: string): Promise<string> {
        const resolution = await OptionsResolver(options,
            altKey ? altKey : 'url',
            () => secondSource ? secondSource.url : undefined,
            altText ? altText : 'Enter the Symbol node URL. (Example: http://localhost:3000): ',
            'text',
            undefined)
        return resolution.endsWith('/') ? resolution.slice(0, -1) : resolution
    }
}
