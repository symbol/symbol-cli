import chalk from 'chalk'
import {NetworkType, PublicAccount} from 'nem2-sdk'
import {ProfileOptions} from '../interfaces/profile.command'
import {Profile} from '../models/profile'
import {OptionsResolver} from '../options-resolver'
import {PublicKeyValidator} from '../validators/publicKey.validator'
import {Resolver} from './resolver'

/**
 * Message resolver
 */
export class MessageResolver implements Resolver {

    /**
     * Resolves a message provided by the user.
     * @param {ProfileOptions} options - Command options.
     * @param {Profile} secondSource - Secondary data source.
     * @param {string} altText - Alternative text.
     * @param {string} altKey - Alternative key.
     * @returns {Promise<string>}
     */
    async resolve(options: ProfileOptions, secondSource?: Profile, altText?: string, altKey?: string): Promise<string> {
        const resolution = await OptionsResolver(options,
            altKey ? altKey : 'message',
            () =>  undefined,
            altText ? altText : 'Enter a message: ')
        return resolution
    }
}
