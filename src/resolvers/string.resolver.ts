import {OptionsResolver} from '../options-resolver'
import {Resolver} from './resolver'
import {Options} from 'clime'

/**
 * String resolver
 */
export class StringResolver implements Resolver {

    /**
     * Resolves a string value provided by the user.
     * @param {Options} options - Command options.
     * @param {string} altText - Alternative text.
     * @param {string} altKey - Alternative key.
     * @returns {Promise<string>}
     */
    async resolve(options: Options, altText?: string, altKey?: string): Promise<string> {
        const resolution = await OptionsResolver(options,
            altKey ? altKey : 'value',
            () => undefined,
            altText ? altText : 'Enter a string value:',
            'text',
            undefined)
        return resolution
    }
}
