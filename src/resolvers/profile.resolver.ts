import {ProfileOptions} from '../interfaces/profile.command'
import {ProfileModel} from '../models/profile.model'
import {OptionsResolver} from '../options-resolver'
import {Resolver} from './resolver'

/**
 * Profile name resolver
 */
export class ProfileNameResolver implements Resolver {

    /**
     * Resolves a profile name provided by the user.
     * @param {ProfileOptions} options - Command options.
     * @param {ProfileModel} secondSource - Secondary data source.
     * @param {string} altText - Alternative text.
     * @param {string} altKey - Alternative key.
     * @returns {Promise<string>}
     */
    async resolve(options: ProfileOptions, secondSource?: ProfileModel, altText?: string, altKey?: string): Promise<string> {
        return await OptionsResolver(options,
            altKey ? altKey : 'profile',
            () => undefined,
            altText ? altText : 'Enter a profile name: ',
            'text',
            undefined)
    }
}
