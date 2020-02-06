import {CommandOptions} from '../commands/account/generate'
import {Profile} from '../models/profile'
import {Resolver} from './resolver'
import { OptionsConfirmResolver } from '../options-resolver'

/**
 * Save resolver
 */
export class SaveResolver implements Resolver {

    /**
     * Resolves if the account has to be saved.
     * @param {CommandOptions} options - Command options.
     * @param {Profile} secondSource - Secondary data source.
     * @param {string} altText - Alternative text.
     * @returns {boolean}
     */
    async resolve(options: CommandOptions, secondSource?: Profile, altText?: string): Promise<boolean> {
        if (!options.save) {
            const resolution = await OptionsConfirmResolver(altText ? altText : 'Do you want to save the account?')
            if (resolution) {
                options.save = true
            }
        }
        return options.save
    }
}
