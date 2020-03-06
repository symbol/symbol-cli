import {CommandOptions} from '../commands/account/generate'
import {OptionsConfirmResolver} from '../options-resolver'
import {Resolver} from './resolver'

/**
 * Save resolver
 */
export class SaveResolver implements Resolver {

    /**
     * Resolves if the account has to be saved.
     * @param {CommandOptions} options - Command options.
     * @param {string} altText - Alternative text.
     * @returns {Promise<boolean>}
     */
    async resolve(options: CommandOptions, altText?: string): Promise <boolean> {
        if (await OptionsConfirmResolver(options, 'save',altText ? altText : 'Do you want to save the account?')) {
            options.save = true
        }
        return options.save
    }
}
