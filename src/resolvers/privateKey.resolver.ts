import {OptionsResolver} from '../options-resolver'
import {PrivateKeyValidator} from '../validators/privateKey.validator'
import {Resolver} from './resolver'
import {Options} from 'clime'

/**
 * Private key resolver
 */
export class PrivateKeyResolver implements Resolver {

    /**
     * Resolves a private key provided by the user.
     * @param {Options} options - Command options.
     * @param {string} altText - Alternative text.
     * @param {string} altKey - Alternative key.
     * @returns {Promise<string>}
     */
    async resolve(options: Options, altText?: string, altKey?: string): Promise<string> {
        const resolution = await OptionsResolver(options,
            altKey ? altKey : 'privateKey',
            () => undefined,
            altText ? altText : 'Enter your account private key:',
            'password',
            new PrivateKeyValidator())
        return resolution
    }
}
