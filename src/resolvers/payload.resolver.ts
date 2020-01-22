import {InnerTransaction, Transaction, TransactionMapping} from 'nem2-sdk';
import {ProfileOptions} from '../commands/profile.command';
import {Profile} from '../models/profile';
import {OptionsResolver} from '../options-resolver';
import {Resolver} from './resolver';

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
    async resolve(options: ProfileOptions, secondSource?: Profile, altText?: string): Promise<Transaction | InnerTransaction> {
        const resolution = (await OptionsResolver(options,
            'payload',
            () => undefined,
            altText ? altText : 'Enter a transaction payload: ')).trim();
        const transaction = TransactionMapping.createFromPayload(resolution);
        return transaction;
    }
}
