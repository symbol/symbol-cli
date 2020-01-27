import {ProfileOptions} from '../interfaces/profile.command';
import {Profile} from '../models/profile';
import {OptionsResolver} from '../options-resolver';
import {TransactionTypeValidator} from '../validators/transactionType.validator';
import {Resolver} from './resolver';

/**
 * Transaction type resolver
 */
export class TransactionTypeResolver implements Resolver {

    /**
     * Resolves a transaction type provided by the user.
     * @param {ProfileOptions} options - Command options.
     * @param {Profile} secondSource - Secondary data source.
     * @param {string} altText - Alternative text.
     * @returns {number}
     */
    resolve(options: ProfileOptions, secondSource?: Profile, altText?: string): number {
        const resolution = OptionsResolver(options,
            'transactionType',
            () => undefined,
            altText ? altText : 'Enter the transaction type. Example: 4154 (Transfer): ').trim();
        new TransactionTypeValidator().validate(resolution);
        return parseInt(resolution, 16);
    }
}
