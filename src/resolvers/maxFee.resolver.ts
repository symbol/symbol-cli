import {UInt64} from 'nem2-sdk';
import {ProfileOptions} from '../commands/profile.command';
import {Profile} from '../models/profile';
import {OptionsResolver} from '../options-resolver';
import {Resolver} from './resolver';

/**
 * Max fee resolver
 */
export class MaxFeeResolver implements Resolver {

    /**
     * Resolves a max fee provided by the user.
     * @param {ProfileOptions} options - Command options.
     * @param {Profile} secondSource - Secondary data source.
     * @param {string} altText - Alternative text.
     * @param {string} altKey - Alternative key.
     * @returns {UInt64}
     */
    resolve(options: ProfileOptions, secondSource?: Profile, altText?: string, altKey?: string): any {
        const resolution = OptionsResolver(options,
        altKey ? altKey : 'maxFee',
        () => undefined,
        altText ? altText : 'Enter the maximum fee (absolute amount): ').trim();
        try {
           return UInt64.fromNumericString(resolution);
        }  catch {
           return UInt64.fromUint(0);
        }
    }
}
