import {UInt64} from 'nem2-sdk'
import {ProfileOptions} from '../interfaces/profile.command'
import {Profile} from '../models/profile'
import {OptionsResolver} from '../options-resolver'
import {KeyValidator} from '../validators/key.validator'
import {Resolver} from './resolver'

export class KeyResolver implements Resolver {
    /**
     * Resolves a string key provided by user.
     * @param {ProfileOptions} options - Command options.
     * @param {Profile} secondSource - Secondary data source.
     * @param {string} altText - Alternative text.
     * @returns {UInt64}
     */
    resolve(options: ProfileOptions, secondSource?: Profile, altText?: string, altKey?: string): UInt64 {
        const resolution = OptionsResolver(options,
            altKey ? altKey : 'key',
            () => undefined,
            altText ?
            altText : 'Enter a UInt64 key in hexadecimal format.' +
                ' You can use the command \'nem2-cli converter stringtokey\' ' +
                'to turn an string into a valid key: ').trim()
        new KeyValidator().validate(resolution)
        return UInt64.fromHex(resolution)
    }
}
