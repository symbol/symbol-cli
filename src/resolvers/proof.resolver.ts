import {OptionsResolver} from '../options-resolver'
import {Resolver} from './resolver'
import {Options} from 'clime'

/**
 * Proof resolver
 */
export class ProofResolver implements Resolver {

    /**
     * Resolves an secret provided by the user.
     * @param {Options} options - Command options.
     * @param {string} altText - Alternative text.
     * @param {string} altKey - Alternative key.
     * @returns {Promise<string>}
     */
    async resolve(options: Options, altText?: string, altKey?: string): Promise<string> {
        const resolution = await OptionsResolver(options,
            altKey ? altKey : 'proof',
            () => undefined,
            altText ? altText : 'Enter the original random set of bytes in hexadecimal:',
            'text',
            undefined)
        return resolution
    }
}
