import {Profile} from '../models/profile.model'
import {OptionsResolver} from '../options-resolver'
import {Resolver} from './resolver'
import {TransactionURIValidator} from '../validators/transactionURI.validator'
import {Options} from 'clime'
import {TransactionURI} from 'symbol-uri-scheme'

/**
 * TransactionURI resolver
 */
export class TransactionURIResolver implements Resolver {

    /**
     * Resolves a Transaction URI provided by the user.
     * @param {Options} options - Command options.
     * @param {Profile} secondSource - Secondary data source.
     * @param {string} altText - Alternative text.
     * @param {string} altKey - Alternative key.
     * @returns {Promise<string>}
     */
    async resolve(options: Options, secondSource?: Profile, altText?: string, altKey?: string): Promise<TransactionURI> {
        const resolution = await OptionsResolver(options,
            altKey ? altKey : 'uri',
            () => secondSource ? secondSource.url : undefined,
            altText ? altText : 'Enter the Transaction URI:',
            'text',
            new TransactionURIValidator())
        return TransactionURI.fromURI(resolution)
    }
}
