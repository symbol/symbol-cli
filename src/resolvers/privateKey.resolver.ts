import {Password} from 'symbol-sdk'
import {ProfileOptions} from '../interfaces/profile.command'
import {Profile} from '../models/profile'
import {OptionsResolver} from '../options-resolver'
import {PrivateKeyValidator} from '../validators/privateKey.validator'
import {Resolver} from './resolver'

/**
 * Private key resolver
 */
export class PrivateKeyResolver implements Resolver {

    /**
     * Resolves a private key provided by the user.
     * @param {ProfileOptions} options - Command options.
     * @param {Profile} secondSource - Secondary data source.
     * @param {string} altText - Alternative text.
     * @param {string} altKey - Alternative key.
     * @returns {string}
     */
    resolve(options: ProfileOptions, secondSource?: Profile, altText?: string, altKey?: string): string {
        const resolution = OptionsResolver(options,
            altKey ? altKey : 'privateKey',
            () => undefined,
            'Enter your account private key: ',
            undefined,
            true).trim()
        new PrivateKeyValidator().validate(resolution)
        return resolution
    }
}
