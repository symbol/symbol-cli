import {OptionsResolver} from '../options-resolver'
import {PasswordValidator} from '../validators/password.validator'
import {Resolver} from './resolver'
import {Password} from 'symbol-sdk'
import {Options} from 'clime'

/**
 * Password resolver
 */
export class PasswordResolver implements Resolver {

    /**
     * Resolves a password provided by the user.
     * @param {Options} options - Command options.
     * @param {string} altText - Alternative text.
     * @param {string} altKey - Alternative key.
     * @returns {Promise<Password>}
     */
    async resolve(options: Options, altText?: string, altKey?: string): Promise<Password> {
        const resolution = await OptionsResolver(options,
            altKey ? altKey : 'password',
            () => undefined,
            altText ? altText : 'Enter your wallet password:',
            'password',
            new PasswordValidator())
        return new Password(resolution)
    }
}
