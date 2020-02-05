import chalk from 'chalk'
import {HashType} from 'nem2-sdk'
import {isNumeric} from 'rxjs/internal-compatibility'
import {ProfileOptions} from '../interfaces/profile.command'
import {Profile} from '../models/profile'
import {OptionsChoiceResolver} from '../options-resolver'
import {HashAlgorithmValidator} from '../validators/hashAlgorithm.validator'
import {Resolver} from './resolver'

/**
 * Link hashAlgorithm resolver
 */
export class HashAlgorithmResolver implements Resolver {

    /**
     * Resolves an hashAlgorithm provided by the user.
     * @param {ProfileOptions} options - Command options.
     * @param {Profile} secondSource - Secondary data source.
     * @param {string} altText - Alternative text.
     * @returns {number}
     */
    async resolve(options: ProfileOptions, secondSource?: Profile, altText?: string): Promise<any> {
        const choices = [
            {title: 'Op_Sha3_256', value: 0},
            {title: 'Op_Keccak_256', value: 1},
            {title: 'Op_Hash_160', value: 2},
            {title: 'Op_Hash_256', value: 3},
        ]

        const index = +(await OptionsChoiceResolver(options,
        'hashAlgorithm',
            altText ? altText : 'Select the algorithm used to hash the proof: ',
        choices,
        ))

        const hashAlgorithm = choices.find((item) => {
            return item.value === index
        })?.title as any
        try {
            new HashAlgorithmValidator().validate(hashAlgorithm)
        } catch (err) {
            console.log(chalk.red('ERR'), err)
            return process.exit()
        }
        return index
    }
}
