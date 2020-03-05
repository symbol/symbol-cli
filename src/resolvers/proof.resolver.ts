import {ProfileOptions} from '../interfaces/profile.command'
import {ProfileModel} from '../models/profile.model'
import {OptionsResolver} from '../options-resolver'
import {Resolver} from './resolver'

/**
 * Proof resolver
 */
export class ProofResolver implements Resolver {

    /**
     * Resolves an secret provided by the user.
     * @param {ProfileOptions} options - Command options.
     * @param {ProfileModel} secondSource - Secondary data source.
     * @param {string} altText - Alternative text.
     * @param {string} altKey - Alternative key.
     * @returns {Promise<string>}
     */
    async resolve(options: ProfileOptions, secondSource?: ProfileModel, altText?: string, altKey?: string): Promise<string> {
        const resolution = await OptionsResolver(options,
            altKey ? altKey : 'proof',
            () => undefined,
            altText ? altText : 'Enter the original random set of bytes in hexadecimal:',
            'text',
            undefined)
        return resolution
    }
}
