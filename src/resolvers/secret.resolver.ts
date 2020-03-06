import {OptionsResolver} from '../options-resolver'
import {Resolver} from './resolver'
import {Options} from 'clime'

/**
 * Secret resolver
 */
export class SecretResolver implements Resolver {

    /**
     * Resolves an secret provided by the user.
     * @param {Options} options - Command options.
     * @param {string} altText - Alternative text.
     * @param {string} altKey - Alternative key.
     * @returns {Promise<string>}
     */
    async resolve(options: Options, altText?: string, altKey?: string): Promise<string> {
        const resolution = await OptionsResolver(options,
            altKey ? altKey : 'secret',
            () => undefined,
            altText ? altText : 'Enter proof hashed in hexadecimal format:',
            'text',
            undefined)
        return resolution
    }
}
