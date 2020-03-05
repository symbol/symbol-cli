import {ProfileOptions} from '../interfaces/profile.command'
import {Profile} from '../models/profile.model'
import {OptionsResolver} from '../options-resolver'
import {HexAddressValidator} from '../validators/hexAddress.validator'
import {Resolver} from './resolver'

/**
 * Hex Address resolver
 */
export class HexAddressResolver implements Resolver {

    /**
     * Resolves an address provided by the user.
     * @param {ProfileOptions} options - Command options.
     * @param {Profile} secondSource - Secondary data source.
     * @param {string} altText - Alternative text.
     * @param {string} altKey - Alternative key.
     * @returns {Promise<string>}
     */
    async resolve(options: ProfileOptions, secondSource?: Profile, altText?: string, altKey?: string): Promise<string> {
        const resolution = await OptionsResolver(options,
            altKey ? altKey : 'address',
            () => secondSource ? secondSource.address.pretty() : undefined,
            altText ? altText : 'Enter an hex address:',
            'text',
            new HexAddressValidator())
        return resolution
    }
}
