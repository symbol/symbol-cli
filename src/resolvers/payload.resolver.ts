import {OptionsResolver} from '../options-resolver'
import {Resolver} from './resolver'
import {InnerTransaction, Transaction, TransactionMapping} from 'symbol-sdk'
import {Options} from 'clime'

/**
 * Payload resolver
 */
export class PayloadResolver implements Resolver {

    /**
     * Resolves an transaction payload provided by the user.
     * @param {Options} options - Command options.
     * @param {string} altText - Alternative text.
     * @param {string} altKey - Alternative key.
     * @returns {Promise<Transaction | InnerTransaction>}
     */
    async resolve(options: Options,
                altText?: string,
                altKey?: string): Promise<Transaction | InnerTransaction> {
        const resolution = await OptionsResolver(options,
            altKey ? altKey : 'payload',
            () => undefined,
            altText ? altText : 'Enter a transaction payload:',
            'text',
            undefined)
        const transaction = TransactionMapping.createFromPayload(resolution)
        return transaction
    }
}
