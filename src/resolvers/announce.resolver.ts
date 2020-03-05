import {AnnounceTransactionsOptions} from '../interfaces/announce.transactions.command'
import {ProfileModel} from '../models/profile.model'
import {Resolver} from './resolver'
import {OptionsConfirmResolver} from '../options-resolver'

/**
 * Announce resolver
 */
export class AnnounceResolver implements Resolver {

    /**
     * Resolves if the user wants to announce the transaction.
     * @param {CreateProfileOptions} options - Command options.
     * @param {ProfileModel} secondSource - Secondary data source.
     * @param {string} altText - Alternative text.
     * @returns {Promise<boolean>}
     */
    async resolve(options: AnnounceTransactionsOptions, secondSource?: ProfileModel, altText?: string): Promise<boolean> {
        if (await OptionsConfirmResolver(options, 'announce', altText ? altText : 'Do you want to announce this transaction?')) {
            options.announce = true
        }
        return options.announce
    }
}
