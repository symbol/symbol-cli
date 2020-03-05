import {ProfileOptions} from '../interfaces/profile.command'
import {Profile} from '../models/profile.model'
import {OptionsResolver} from '../options-resolver'
import {TransactionTypeValidator} from '../validators/transactionType.validator'
import {Resolver} from './resolver'

/**
 * Transaction type resolver
 */
export class TransactionTypeResolver implements Resolver {

    /**
     * Resolves a transaction type provided by the user.
     * @param {ProfileOptions} options - Command options.
     * @param {Profile} secondSource - Secondary data source.
     * @param {string} altText - Alternative text.
     * @param {string} altKey - Alternative key.
     * @returns {Promise<number>}
     */
    async resolve(options: ProfileOptions, secondSource?: Profile, altText?: string, altKey?: string): Promise<number> {
        const resolution = await OptionsResolver(options,
            altKey ? altKey : 'transactionType',
            () => undefined,
            altText ? altText : 'Enter the transaction type. Example: 4154 (Transfer):',
            'text',
            new TransactionTypeValidator())
        return parseInt(resolution, 16)
    }
}
