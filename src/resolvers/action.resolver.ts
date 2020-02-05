import chalk from 'chalk'
import {ProfileOptions} from '../commands/profile.command'
import {Profile} from '../models/profile'
import {OptionsChoiceResolver} from '../options-resolver'
import {BinaryValidator} from '../validators/binary.validator'
import {Resolver} from './resolver'

/**
 * Link action resolver
 */
export class ActionResolver implements Resolver {

    /**
     * Resolves an action provided by the user.
     * @param {ProfileOptions} options - Command options.
     * @param {Profile} secondSource - Secondary data source.
     * @param {string} altText - Alternative text.
     * @returns {number}
     */
    async resolve(options: ProfileOptions, secondSource?: Profile, altText?: string): Promise<any> {
        const choices = [
            {title: 'Remove', value: 0},
            {title: 'Add', value: 1},
        ]
        const index = +(await OptionsChoiceResolver(options,
            'action',
            altText ? altText : 'Select an action: ',
            choices,
        ))
        try {
            new BinaryValidator().validate(index)
        } catch (err) {
            console.log(chalk.red('ERR'), err)
            return process.exit()
        }
        return index
    }
}

/**
 * Link action resolver
 */
export class LinkActionResolver implements Resolver {

    /**
     * Resolves an action provided by the user.
     * @param {ProfileOptions} options - Command options.
     * @param {Profile} secondSource - Secondary data source.
     * @param {string} altText - Alternative text.
     * @returns {number}
     */
    async resolve(options: ProfileOptions, secondSource?: Profile, altText?: string): Promise<any> {
        const choices = [
            {title: 'Unlink', value: 0},
            {title: 'Link', value: 1},
        ]
        const index = +(await OptionsChoiceResolver(options,
            'action',
            altText ? altText : 'Select an action: ',
            choices,
        ))
        try {
            new BinaryValidator().validate(index)
        } catch (err) {
            console.log(chalk.red('ERR'), err)
            return process.exit()
        }
        return index
    }
}

export class SupplyActionResolver implements Resolver {

    /**
     * Resolves an action provided by the user.
     * @param {ProfileOptions} options - Command options.
     * @param {Profile} secondSource - Secondary data source.
     * @param {string} altText - Alternative text.
     * @returns {number}
     */
    async resolve(options: ProfileOptions, secondSource?: Profile, altText?: string): Promise<any> {
        const choices = [
            {title: 'Decrease', value: 0},
            {title: 'Increase', value: 1},
        ]
        const index = +(await OptionsChoiceResolver(options,
            'action',
            altText ? altText : 'Select an action: ',
            choices,
        ))
        try {
            new BinaryValidator().validate(index)
        } catch (err) {
            console.log(chalk.red('ERR'), err)
            return process.exit()
        }
        return index
    }
}
