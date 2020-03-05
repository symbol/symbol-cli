import {UInt64} from 'symbol-sdk'
import {ProfileOptions} from '../interfaces/profile.command'
import {ProfileModel} from '../models/profile.model'
import {OptionsResolver} from '../options-resolver'
import {KeyValidator} from '../validators/key.validator'
import {Resolver} from './resolver'

export class KeyResolver implements Resolver {
    /**
     * Resolves a string key provided by user.
     * @param {ProfileOptions} options - Command options.
     * @param {ProfileModel} secondSource - Secondary data source.
     * @param {string} altText - Alternative text.
     * @param {string} altKey - Alternative key.
     * @returns {Promise<UInt64>}
     */
    async resolve(options: ProfileOptions, secondSource?: ProfileModel, altText?: string, altKey?: string): Promise<UInt64> {
        const resolution = await OptionsResolver(options,
            altKey ? altKey : 'key',
            () => undefined,
            altText ?
            altText : 'Enter a UInt64 key in hexadecimal format.' +
                ' You can use the command \'symbol-cli converter stringtokey\' ' +
                'to turn an string into a valid key:',
            'text',
            new KeyValidator())
        return UInt64.fromHex(resolution)
    }
}
