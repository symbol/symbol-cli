import {OptionsChoiceResolver} from '../options-resolver'
import {ActionValidator, LinkActionValidator, MosaicSupplyChangeActionValidator} from '../validators/action.validator'
import {ActionType} from '../models/action.enum'
import {Resolver} from './resolver'
import {LinkAction, MosaicSupplyChangeAction} from 'symbol-sdk'
import {Options} from 'clime'

/**
 * Link action resolver
 */
export class ActionResolver implements Resolver {

    /**
     * Resolves an action provided by the user.
     * @param {Options} options - Command options.
     * @param {string} altText - Alternative text.
     * @param {string} altKey - Alternative key.
     * @returns {Promise<number>}
     */
    async resolve(options: Options, altText?: string, altKey?: string): Promise<number> {
        const choices = Object
            .keys(ActionType)
            .filter((key) => Number.isNaN(parseFloat(key)))
            .map((string) => ({
                title: string,
                value: ActionType[string as any],
            }))

        const value = +(await OptionsChoiceResolver(options,
            altKey ? altKey : 'action',
            altText ? altText : 'Select an action:',
            choices,
            'select',
            new ActionValidator()
        ))
        return value
    }
}

/**
 * Link action resolver
 */
export class LinkActionResolver implements Resolver {

    /**
     * Resolves an action provided by the user.
     * @param {Options} options - Command options.
     * @param {string} altText - Alternative text.
     * @param {string} altKey - Alternative key.
     * @returns {Promise<number>}
     */
    async resolve(options: Options, altText?: string, altKey?: string): Promise<number> {
        const choices = Object
            .keys(LinkAction)
            .filter((key) => Number.isNaN(parseFloat(key)))
            .map((string) => ({
                title: string,
                value: LinkAction[string as any],
            }))

        const value = +(await OptionsChoiceResolver(options,
            altKey ? altKey : 'action',
            altText ? altText : 'Select an action:',
            choices,
            'select',
            new LinkActionValidator()
        ))
        return value
    }
}

export class SupplyActionResolver implements Resolver {

    /**
     * Resolves an action provided by the user.
     * @param {Options} options - Command options.
     * @param {string} altText - Alternative text.
     * @param {string} altKey - Alternative key.
     * @returns {Promise<number>}
     */
    async resolve(options: Options, altText?: string, altKey?: string): Promise<number> {
        const choices = Object
            .keys(MosaicSupplyChangeAction)
            .filter((key) => Number.isNaN(parseFloat(key)))
            .map((string) => ({
                title: string,
                value: MosaicSupplyChangeAction[string as any],
            }))

        const value = +(await OptionsChoiceResolver(options,
            altKey ? altKey : 'action',
            altText ? altText : 'Select an action:',
            choices,
            'select',
            new MosaicSupplyChangeActionValidator()
        ))
        return value
    }
}
