import {OptionsResolver} from '../options-resolver'
import {HashValidator} from '../validators/hash.validator'
import {Resolver} from './resolver'
import {Options} from 'clime'

/**
 * Hash resolver
 */
export class HashResolver implements Resolver {

    /**
     * Resolves a hash provided by the user.
     * @param {Options} options - Command options.
     * @param {string} altText - Alternative text.
     * @param {string} altKey - Alternative key.
     * @returns {Promise<string>}
     */
    async resolve(options: Options, altText?: string, altKey?: string): Promise<string> {
        const resolution = await OptionsResolver(options,
            altKey ? altKey : 'hash',
            () => undefined,
            altText ? altText : 'Enter a transaction hash:',
            'text',
            new HashValidator())
        return resolution
    }
}
