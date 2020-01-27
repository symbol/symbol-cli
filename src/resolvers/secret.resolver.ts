import {ProfileOptions} from '../interfaces/profile.command';
import {Profile} from '../models/profile';
import {OptionsResolver} from '../options-resolver';
import {Resolver} from './resolver';

/**
 * Secret resolver
 */
export class SecretResolver implements Resolver {

    /**
     * Resolves an secret provided by the user.
     * @param {ProfileOptions} options - Command options.
     * @param {Profile} secondSource - Secondary data source.
     * @param {string} altText - Alternative text.
     * @returns {string}
     */
    resolve(options: ProfileOptions, secondSource?: Profile, altText?: string): any {
        const resolution = OptionsResolver(options,
        'secret',
        () => undefined,
        altText ? altText : 'Enter proof hashed in hexadecimal format: ').trim();
        return resolution;
    }
}
