import {InnerTransaction, Transaction, TransactionMapping} from 'symbol-sdk'
import {ProfileOptions} from '../interfaces/profile.command'
import {Profile} from '../models/profile'
import {OptionsResolver} from '../options-resolver'
import {Resolver} from './resolver'

/**
 * Payload resolver
 */
export class PayloadResolver implements Resolver {

    /**
     * Resolves an transaction payload provided by the user.
     * @param {ProfileOptions} options - Command options.
     * @param {Profile} secondSource - Secondary data source.
     * @param {string} altText - Alternative text.
     * @param {string} altKey - Alternative key.
     * @returns {Promise<Transaction | InnerTransaction>}
     */
    async resolve(options: ProfileOptions,
                secondSource?: Profile,
                altText?: string,
                altKey?: string): Promise<Transaction | InnerTransaction> {
        const resolution = await OptionsResolver(options,
            altKey ? altKey : 'payload',
            () => undefined,
            altText ? altText : 'Enter a transaction payload: ')
        const transaction = TransactionMapping.createFromPayload(resolution)
        return transaction
    }
}
