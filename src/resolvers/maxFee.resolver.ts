import {UInt64} from 'nem2-sdk';
import {Profile} from '../model/profile';
import {OptionsResolver} from '../options-resolver';
import {ProfileOptions} from '../profile.command';
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
    async resolve(options: ProfileOptions, secondSource?: Profile, altText?: string, altKey?: string): Promise<any> {
        const resolution = await OptionsResolver(options,
        altKey ? altKey : 'maxFee',
        () => undefined,
        altText ? altText : 'Enter the maximum fee (absolute amount): ');
        try {
           return UInt64.fromNumericString(resolution);
        }  catch {
           return UInt64.fromUint(0);
        }
    }
}
