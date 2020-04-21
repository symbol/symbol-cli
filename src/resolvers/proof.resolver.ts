import {OptionsResolver} from '../options-resolver'
import {Resolver} from './resolver'
import {ProofValidator} from '../validators/proof.validator'
import {SecretProofCommandOptions} from '../commands/transaction/secretproof'
import {LockHashAlgorithm} from 'symbol-sdk'

/**
 * Proof resolver
 */
export class ProofResolver implements Resolver {

    /**
     * Resolves an secret provided by the user.
     * @param {Options} options - Command options.
     * @param {string} altText - Alternative text.
     * @param {string} altKey - Alternative key.
     * @returns {Promise<string>}
     */
    async resolve(options: SecretProofCommandOptions, hashType?: LockHashAlgorithm, altText?: string, altKey?: string): Promise<string> {
        const resolution = await OptionsResolver(options,
            altKey ? altKey : 'proof',
            () => undefined,
            altText ? altText : 'Enter the original random set of bytes in hexadecimal:',
            'text',
            new ProofValidator(hashType))
        return resolution
    }
}
