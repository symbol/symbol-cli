import chalk from 'chalk'
import {UInt64} from 'nem2-sdk'
import {ProfileOptions} from '../commands/profile.command'
import {Profile} from '../models/profile'
import {OptionsResolver} from '../options-resolver'
import {HeightValidator} from '../validators/block.validator'
import {Resolver} from './resolver'

/**
 * Height resolver
 */
export class HeightResolver implements Resolver {

    /**
     * Resolves a height provided by the user.
     * @param {ProfileOptions} options - Command options.
     * @param {Profile} secondSource - Secondary data source.
     * @param {string} altText - Alternative text.
     * @returns {UInt64}
     */
    async resolve(options: ProfileOptions, secondSource?: Profile, altText?: string): Promise<UInt64> {
        const resolution = await OptionsResolver(options,
        'height',
        () =>  undefined,
        altText ? altText : 'Enter the block height: ')
        try {
            new HeightValidator().validate(resolution)
        } catch (err) {
            console.log(chalk.red('ERR'), err)
            return process.exit()
        }
        return  UInt64.fromNumericString(resolution)
    }
}
