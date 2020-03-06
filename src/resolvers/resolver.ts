import {Options} from 'clime'

/**
 * URL resolver
 */
export interface Resolver {

    /**
     * Resolves an url provided by the user.
     * @param {Options} options - Command options.
     * @param {any} secondSource - Secondary data source.
     * @param {string} altText - Alternative text.
     * @param {string} altKey - Alternative key.
     * @returns {any}
     */
    resolve(options: Options, secondSource?: any, altText?: string, altKey?: string): any;
}
