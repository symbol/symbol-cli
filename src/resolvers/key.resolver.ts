import {OptionsResolver} from '../options-resolver'
import {KeyValidator} from '../validators/key.validator'
import {Resolver} from './resolver'
import {UInt64} from 'symbol-sdk'
import {Options} from 'clime'

export class KeyResolver implements Resolver {
    /**
     * Resolves a string key provided by user.
     * @param {Options} options - Command options.
     * @param {string} altText - Alternative text.
     * @param {string} altKey - Alternative key.
     * @returns {Promise<UInt64>}
     */
    async resolve(options: Options, altText?: string, altKey?: string): Promise<UInt64> {
        const resolution = await OptionsResolver(options,
            altKey ? altKey : 'key',
            () => undefined,
            altText ?
            altText : 'Enter a UInt64 key in hexadecimal format.' +
                ' You can use the command \'symbol-cli converter stringtokey\' ' +
                'to turn a string into a valid key:',
            'text',
            new KeyValidator())
        return UInt64.fromHex(resolution)
    }
}
