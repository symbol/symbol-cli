import * as readlineSync from 'readline-sync'
import {CreateProfileOptions} from '../interfaces/create.profile.command'
import {Profile} from '../models/profile'
import {Resolver} from './resolver'
import {OptionsConfirmResolver} from '../options-resolver'

/**
 * Default resolver
 */
export class DefaultResolver implements Resolver {

    /**
     * Resolves if an account has to be set as default.
     * @param {CreateProfileOptions} options - Command options.
     * @param {Profile} secondSource - Secondary data source.
     * @param {string} altText - Alternative text.
     * @returns {boolean}
     */
    async resolve(options: CreateProfileOptions, secondSource?: Profile, altText?: string): Promise<boolean> {
        if (!options.default) {
            const resolution = await OptionsConfirmResolver(altText ? altText : 'Do you want to set the account as the default profile?');
            if (resolution) {
                options.default = true
            }
        }
        return options.default
    }
}
