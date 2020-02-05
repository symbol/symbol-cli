import {ProfileOptions} from '../interfaces/profile.command'
import {Profile} from '../models/profile'
import {OptionsResolver} from '../options-resolver'
import {Resolver} from './resolver'

/**
 * Proof resolver
 */
export class ProofResolver implements Resolver {

    /**
     * Resolves an secret provided by the user.
     * @param {ProfileOptions} options - Command options.
     * @param {Profile} secondSource - Secondary data source.
     * @param {string} altText - Alternative text.
     * @returns {string}
     */
    async resolve(options: ProfileOptions, secondSource?: Profile, altText?: string): Promise<string> {
        const resolution = (await OptionsResolver(options,
        'proof',
        () => undefined,
        altText ? altText : 'Enter the original random set of bytes in hexadecimal: ')).trim()
        return resolution
    }
}
