import {OptionsResolver} from '../options-resolver'
import {HeightValidator} from '../validators/block.validator'
import {Resolver} from './resolver'
import {UInt64} from 'symbol-sdk'
import {Options} from 'clime'

/**
 * Height resolver
 */
export class HeightResolver implements Resolver {

    /**
     * Resolves a height provided by the user.
     * @param {Options} options - Command options.
     * @param {string} altText - Alternative text.
     * @param {string} altKey - Alternative key.
     * @returns {Promise<UInt64>}
     */
    async resolve(options: Options, altText?: string, altKey?: string): Promise<UInt64> {
        const resolution = await OptionsResolver(options,
            altKey ? altKey : 'height',
            () =>  undefined,
            altText ? altText : 'Enter the block height:',
            'text',
            new HeightValidator())
        return  UInt64.fromNumericString(resolution)
    }
}
