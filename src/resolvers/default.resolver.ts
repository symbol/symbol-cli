import {CreateProfileOptions} from '../interfaces/create.profile.command'
import {ProfileModel} from '../models/profile.model'
import {Resolver} from './resolver'
import {OptionsConfirmResolver} from '../options-resolver'

/**
 * Default resolver
 */
export class DefaultResolver implements Resolver {

    /**
     * Resolves if an account has to be set as default.
     * @param {CreateProfileOptions} options - Command options.
     * @param {ProfileModel} secondSource - Secondary data source.
     * @param {string} altText - Alternative text.
     * @returns {Promise<boolean>}
     */
    async resolve(options: CreateProfileOptions, secondSource?: ProfileModel, altText?: string): Promise<boolean> {
        if (!options.default && await OptionsConfirmResolver(altText ? altText : 'Do you want to set the account as the default profile?')) {
            options.default = true
        }
        return options.default
    }

}
