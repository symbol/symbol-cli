import {ProfileOptions} from '../interfaces/profile.command'
import {ProfileModel} from '../models/profile.model'
import {OptionsResolver} from '../options-resolver'
import {HashValidator} from '../validators/hash.validator'
import {Resolver} from './resolver'
import chalk from 'chalk'

/**
 * Hash resolver
 */
export class HashResolver implements Resolver {

    /**
     * Resolves a hash provided by the user.
     * @param {ProfileOptions} options - Command options.
     * @param {ProfileModel} secondSource - Secondary data source.
     * @param {string} altText - Alternative text.
     * @param {string} altKey - Alternative key.
     * @returns {Promise<string>}
     */
    async resolve(options: ProfileOptions, secondSource?: ProfileModel, altText?: string, altKey?: string): Promise<string> {
        const resolution = await OptionsResolver(options,
            altKey ? altKey : 'hash',
            () => undefined,
            altText ? altText : 'Enter a transaction hash:',
            'text',
            new HashValidator())
        return resolution
    }
}
