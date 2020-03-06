import {CreateProfileOptions} from '../interfaces/create.profile.command'
import {OptionsConfirmResolver} from '../options-resolver'
import {Resolver} from './resolver'

/**
 * Default resolver
 */
export class DefaultResolver implements Resolver {

    /**
     * Resolves if an account has to be set as default.
     * @param {CreateProfileOptions} options - Command options.
     * @param {string} altText - Alternative text.
     * @returns {Promise<boolean>}
     */
    async resolve(options: CreateProfileOptions, altText?: string): Promise<boolean> {
        if (await OptionsConfirmResolver(options, 'default', altText ?
                altText : 'Do you want to set the account as the default profile?')) {
            options.default = true
        }
        return options.default
    }

}
