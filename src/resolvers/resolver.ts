import {Options} from 'clime';
import {Profile} from '../model/profile';
import {ProfileOptions} from '../profile.command';

/**
 * URL resolver
 */
export interface Resolver {

    /**
     * Resolves an url provided by the user.
     * @param {ProfileOptions} options - Command options.
     * @param {Profile} secondSource - Secondary data source.
     * @param {string} altText - Alternative text.
     * @returns {any}
     */
    resolve(options: Options, secondSource?: any, altText?: string): any;
}
