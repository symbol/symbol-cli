import {ProfileOptions} from '../commands/profile.command';
import {Profile} from '../models/profile';
import {OptionsResolver} from '../options-resolver';
import {Resolver} from './resolver';

/**
 * String resolver
 */
export class StringResolver implements Resolver {

    /**
     * Resolves an string value provided by the user.
     * @param {ProfileOptions} options - Command options.
     * @param {Profile} secondSource - Secondary data source.
     * @param {string} altText - Alternative text.
     * @returns {string}
     */
    resolve(options: ProfileOptions, secondSource?: Profile, altText?: string): any {
        const resolution = OptionsResolver(options,
            'value',
            () => undefined,
            altText ? altText : 'Enter a string value: ').trim();
        return resolution;
    }
}
