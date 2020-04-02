import {ProfileOptions} from '../interfaces/profile.options'
import {OptionsResolver} from '../options-resolver'
import {Resolver} from './resolver'

/**
 * Profile name resolver
 */
export class ProfileNameResolver implements Resolver {

    /**
     * Resolves a profile name provided by the user.
     * @param {Options} options - Command options.
     * @param {string} altText - Alternative text.
     * @param {string} altKey - Alternative key.
     * @returns {Promise<string>}
     */
    async resolve(options: ProfileOptions, altText?: string, altKey?: string): Promise<string> {
        return await OptionsResolver(options,
            altKey ? altKey : 'profile',
            () => undefined,
            altText ? altText : 'Enter a profile name:',
            'text',
            undefined)
    }
}
