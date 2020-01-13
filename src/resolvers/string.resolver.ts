import {Profile} from '../model/profile';
import {OptionsResolver} from '../options-resolver';
import {ProfileOptions} from '../profile.command';
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

export class KeyResolver implements Resolver {
    /**
     * Resolves a string key provided by user.
     * @param {ProfileOptions} options - Command options.
     * @param {Profile} secondSource - Secondary data source.
     * @param {string} altText - Alternative text.
     * @returns {string}
     */
    resolve(options: ProfileOptions, secondSource?: Profile, altText?: string): any {
        const resolution = OptionsResolver(options,
            'key',
            () => undefined,
            altText ? altText : 'Enter a string key: ').trim();
        return resolution;
    }
}
