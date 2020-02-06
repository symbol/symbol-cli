import chalk from 'chalk'
import {ProfileOptions} from '../interfaces/profile.command'
import {Profile} from '../models/profile'
import {OptionsChoiceResolver} from '../options-resolver'
import {BinaryValidator} from '../validators/binary.validator'
import {Resolver} from './resolver'
import {LinkAction, MosaicSupplyChangeAction} from 'nem2-sdk'
import {ActionType} from '../interfaces/action.resolver'
import {ActionValidator, LinkActionValidator, MosaicSupplyChangeActionValidator} from '../validators/action.validator'

/**
 * Link action resolver
 */
export class ActionResolver implements Resolver {

    /**
     * Resolves an action provided by the user.
     * @param {ProfileOptions} options - Command options.
     * @param {Profile} secondSource - Secondary data source.
     * @param {string} altText - Alternative text.
     * @param {string} altKey - Alternative key.
     * @returns {number}
     */
    async resolve(options: ProfileOptions, secondSource?: Profile, altText?: string, altKey?: string): Promise<number> {
        const choices = [
            {title: 'Remove', value: ActionType.Remove},
            {title: 'Add', value: ActionType.Add},
        ]
        const index = +(await OptionsChoiceResolver(options,
            altKey ? altKey : 'action',
            altText ? altText : 'Select an action: ',
            choices,
        ))
        try {
            new ActionValidator().validate(index)
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
     * @param {string} altKey - Alternative key.
     * @returns {number}
     */
    async resolve(options: ProfileOptions, secondSource?: Profile, altText?: string, altKey?: string): Promise<number> {
        const choices = [
            {title: 'Unlink', value: LinkAction.Unlink},
            {title: 'Link', value: LinkAction.Link},
        ]
        const index = +(await OptionsChoiceResolver(options,
            altKey ? altKey : 'action',
            altText ? altText : 'Select an action: ',
            choices,
        ))
        try {
            new LinkActionValidator().validate(index)
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
     * @param {string} altKey - Alternative key.
     * @returns {number}
     */
    async resolve(options: ProfileOptions, secondSource?: Profile, altText?: string, altKey?: string): Promise<number> {
        const choices = [
            {title: 'Decrease', value: MosaicSupplyChangeAction.Decrease},
            {title: 'Increase', value: MosaicSupplyChangeAction.Increase},
        ]
        const index = +(await OptionsChoiceResolver(options,
            altKey ? altKey : 'action',
            altText ? altText : 'Select an action: ',
            choices,
        ))
        try {
            new MosaicSupplyChangeActionValidator().validate(index)
        } catch (err) {
            console.log(chalk.red('ERR'), err)
            return process.exit()
        }
        return index
    }
}
