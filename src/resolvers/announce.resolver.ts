import {AnnounceTransactionsOptions} from '../interfaces/announceTransactions.options'
import {OptionsConfirmResolver} from '../options-resolver'
import {Resolver} from './resolver'

/**
 * Announce resolver
 */
export class AnnounceResolver implements Resolver {

    /**
     * Resolves if the user wants to announce the transaction.
     * @param {CreateProfileOptions} options - Command options.
     * @param {string} altText - Alternative text.
     * @returns {Promise<boolean>}
     */
    async resolve(options: AnnounceTransactionsOptions, altText?: string): Promise<boolean> {
        if (await OptionsConfirmResolver(options, 'announce', altText ? altText : 'Do you want to announce this transaction?')) {
            options.announce = true
        }
        return options.announce
    }
}
