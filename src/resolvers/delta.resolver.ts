import {OptionsResolver} from '../options-resolver'
import {Resolver} from './resolver'
import {Password} from 'symbol-sdk'
import {Options} from 'clime'
import {DeltaValidator} from '../validators/delta.validator'

/**
 * Password resolver
 */
export class DeltaResolver implements Resolver {

    /**
     * Resolves a delta value provided by the user.
     * @param {Options} options - Command options.
     * @param {string} altText - Alternative text.
     * @param {string} altKey - Alternative key.
     * @returns {Promise<Password>}
     */
    async resolve(options: Options, altText: string, altKey?: string): Promise<number> {
        const resolution = await OptionsResolver(options,
            altKey ? altKey : 'delta',
            () => undefined,
            altText,
            'number',
            new DeltaValidator())
        return +resolution
    }
}
