import {ProfileOptions} from '../commands/profile.command';
import {Profile} from '../models/profile';
import {OptionsResolver} from '../options-resolver';
import {HashValidator} from '../validators/hash.validator';
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
    resolve(options: ProfileOptions, secondSource?: Profile, altText?: string): any {
        const resolution = OptionsResolver(options,
            'hash',
            () => undefined,
            altText ? altText : 'Enter a transaction hash: ').trim();
        new HashValidator().validate(resolution);
        return resolution;
    }
}
