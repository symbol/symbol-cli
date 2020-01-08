import {UInt64} from 'nem2-sdk';
import {Profile} from '../model/profile';
import {OptionsResolver} from '../options-resolver';
import {ProfileOptions} from '../profile.command';
import {Resolver} from './resolver';

/**
 * Hash resolver
 */
export class HashResolver implements Resolver {

    /**
     * Resolves a hash provided by the user.
     * @param {ProfileOptions} options - Command options.
     * @param {Profile} secondSource - Secondary data source.
     * @param {string} altText - Alternative text.
     * @returns {string}
     */
    async resolve(options: ProfileOptions, secondSource?: Profile, altText?: string): Promise<any> {
        const resolution = await OptionsResolver(options,
            'hash',
            () => undefined,
            altText ? altText : 'Enter a transaction hash: ');
        return resolution;
    }
}
