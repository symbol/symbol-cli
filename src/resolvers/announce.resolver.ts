import {AnnounceTransactionsOptions} from '../interfaces/announce.transactions.command'
import {Profile} from '../models/profile'
import {Resolver} from './resolver'
import {OptionsConfirmResolver} from '../options-resolver'

/**
 * Announce resolver
 */
export class AnnounceResolver implements Resolver {

    /**
     * Resolves if the user wants to announce the transaction.
     * @param {CreateProfileOptions} options - Command options.
     * @param {Profile} secondSource - Secondary data source.
     * @param {string} altText - Alternative text.
     * @returns {Promise<boolean>}
     */
    async resolve(options: AnnounceTransactionsOptions, secondSource?: Profile, altText?: string): Promise<boolean> {
        if (options.announce) {
            return options.announce
        }
        const resolution = await OptionsConfirmResolver(altText ? altText : 'Do you want to announce this transaction?')
        return resolution
    }
}
