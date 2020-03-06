import {Profile} from '../models/profile.model'
import {OptionsResolver} from '../options-resolver'
import {Resolver} from './resolver'
import {Options} from 'clime'

/**
 * Message resolver
 */
export class MessageResolver implements Resolver {

    /**
     * Resolves a message provided by the user.
     * @param {Options} options - Command options.
     * @param {string} altText - Alternative text.
     * @param {string} altKey - Alternative key.
     * @returns {Promise<string>}
     */
    async resolve(options: Options, secondSource?: Profile, altText?: string, altKey?: string): Promise<string> {
        const resolution = await OptionsResolver(options,
            altKey ? altKey : 'message',
            () =>  undefined,
            altText ? altText : 'Enter a message:',
            'text',
            undefined)
        return resolution
    }
}
