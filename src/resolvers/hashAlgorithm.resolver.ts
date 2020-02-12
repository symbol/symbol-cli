import chalk from 'chalk'
import {ProfileOptions} from '../interfaces/profile.command'
import {Profile} from '../models/profile'
import {OptionsChoiceResolver} from '../options-resolver'
import {HashAlgorithmValidator} from '../validators/hashAlgorithm.validator'
import {Resolver} from './resolver'
import {HashType} from 'nem2-sdk'

/**
 * Link hashAlgorithm resolver
 */
export class HashAlgorithmResolver implements Resolver {

    /**
     * Resolves an hashAlgorithm provided by the user.
     * @param {ProfileOptions} options - Command options.
     * @param {Profile} secondSource - Secondary data source.
     * @param {string} altText - Alternative text.
     * @param {string} altKey - Alternative key.
     * @returns {Promise<number>}
     */
    async resolve(options: ProfileOptions, secondSource?: Profile, altText?: string, altKey?: string): Promise<number> {
        const choices = [
            {title: 'Op_Sha3_256', value: HashType.Op_Sha3_256},
            {title: 'Op_Keccak_256', value: HashType.Op_Keccak_256},
            {title: 'Op_Hash_160', value: HashType.Op_Hash_160},
            {title: 'Op_Hash_256', value: HashType.Op_Hash_256},
        ]

        const index = +(await OptionsChoiceResolver(options,
            altKey ? altKey : 'hashAlgorithm',
            altText ? altText : 'Select the algorithm used to hash the proof: ',
            choices))

        const hashAlgorithm = choices.find((item) => item.value === index)?.title as any
        try {
            new HashAlgorithmValidator().validate(hashAlgorithm)
        } catch (err) {
            console.log(chalk.red('ERR'), err)
            return process.exit()
        }
        return index
    }
}
