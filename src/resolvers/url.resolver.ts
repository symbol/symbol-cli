import {Profile} from '../models/profile.model'
import {OptionsResolver} from '../options-resolver'
import {Resolver} from './resolver'
import {Options} from 'clime'

/**
 * URL resolver
 */
export class URLResolver implements Resolver {

    /**
     * Resolves an url provided by the user.
     * @param {Options} options - Command options.
     * @param {Profile} secondSource - Secondary data source.
     * @param {string} altText - Alternative text.
     * @param {string} altKey - Alternative key.
     * @returns {Promise<string>}
     */
    async resolve(options: Options, secondSource?: Profile, altText?: string, altKey?: string): Promise<string> {
        const resolution = await OptionsResolver(options,
            altKey ? altKey : 'url',
            () => secondSource ? secondSource.url : undefined,
            altText ? altText : 'Enter the Symbol node URL. (Example: http://localhost:3000):',
            'text',
            undefined)
        return resolution.endsWith('/') ? resolution.slice(0, -1) : resolution
    }
}
