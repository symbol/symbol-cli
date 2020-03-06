import {Profile} from '../models/profile.model'
import {OptionsResolver} from '../options-resolver'
import {HexAddressValidator} from '../validators/hexAddress.validator'
import {Resolver} from './resolver'
import {Options} from 'clime'

/**
 * Hex Address resolver
 */
export class HexAddressResolver implements Resolver {

    /**
     * Resolves an address provided by the user.
     * @param {Options} options - Command options.
     * @param {Profile} secondSource - Secondary data source.
     * @param {string} altText - Alternative text.
     * @param {string} altKey - Alternative key.
     * @returns {Promise<string>}
     */
    async resolve(options: Options, secondSource?: Profile, altText?: string, altKey?: string): Promise<string> {
        const resolution = await OptionsResolver(options,
            altKey ? altKey : 'address',
            () => secondSource ? secondSource.address.pretty() : undefined,
            altText ? altText : 'Enter an hex address:',
            'text',
            new HexAddressValidator())
        return resolution
    }
}
