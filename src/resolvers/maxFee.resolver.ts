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
     * @returns {UInt64}
     */
    async resolve(options: ProfileOptions, secondSource?: Profile, altText?: string): Promise<UInt64> {
        const resolution = await OptionsResolver(options,
        'maxFee',
        () => undefined,
        altText ? altText : 'Enter the maximum fee (absolute amount): ');
        try {
           return UInt64.fromNumericString(resolution);
        }  catch {
           return UInt64.fromUint(0);
        }
    }
}

/**
 * Max fee resolver
 */
export class MaxFeeHashLockResolver implements Resolver {

    /**
     * Resolves a max fee hash lock provided by the user.
     * @param {ProfileOptions} options - Command options.
     * @param {Profile} secondSource - Secondary data source.
     * @param {string} altText - Alternative text.
     * @returns {UInt64}
     */
    async resolve(options: ProfileOptions, secondSource?: Profile, altText?: string): Promise<UInt64> {
        const resolution = await OptionsResolver(options,
            'maxFeeHashLock',
            () => undefined,
            altText ? altText : 'Enter the maximum fee to announce the hashlock transaction (absolute amount): ');
        try {
            return UInt64.fromNumericString(resolution);
        }  catch {
            return UInt64.fromUint(0);
        }
    }
}
