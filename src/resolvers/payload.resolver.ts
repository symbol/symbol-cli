import {Transaction, TransactionMapping} from 'nem2-sdk'
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
     * @returns {Transaction}
     */
    resolve(options: ProfileOptions, secondSource?: Profile, altText?: string): Transaction {
        const resolution = OptionsResolver(options,
            'payload',
            () => undefined,
            altText ? altText : 'Enter a transaction payload: ').trim()
        const transaction = TransactionMapping.createFromPayload(resolution)
        return transaction
    }
}
