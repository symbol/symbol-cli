import {OptionsChoiceResolver} from '../options-resolver'
import {AccountRestrictionFlagsValidator} from '../validators/restrictionType.validator'
import {Resolver} from './resolver'
import {AccountRestrictionFlags} from 'symbol-sdk'
import {Options} from 'clime'

/**
 * Restriction account address flags resolver
 */
export class RestrictionAccountAddressFlagsResolver implements Resolver {

    /**
     * Resolves a restriction account address flag provided by the user.
     * @param {Options} options - Command options.
     * @param {string} altText - Alternative text.
     * @param {string} altKey - Alternative key.
     * @returns {Promise<number>}
     */
    async resolve(options: Options, altText?: string, altKey?: string): Promise<number> {
        const choices = [
            {title: 'AllowOutgoingAddress', value: AccountRestrictionFlags.AllowOutgoingAddress},
            {title: 'BlockOutgoingAddress', value: AccountRestrictionFlags.BlockOutgoingAddress},
            {title: 'AllowIncomingAddress', value: AccountRestrictionFlags.AllowIncomingAddress},
            {title: 'BlockIncomingAddress', value: AccountRestrictionFlags.BlockIncomingAddress},
        ]
        const value = +(await OptionsChoiceResolver(options,
            altKey ? altKey : 'flags',
            altText ? altText : 'Select the restriction flags:',
            choices,
            'select',
            new AccountRestrictionFlagsValidator()
        ))
        return value
    }
}

/**
 * Restriction account mosaic flags resolver
 */
export class RestrictionAccountMosaicFlagsResolver implements Resolver {

    /**
     * Resolves a restriction account mosaic flag provided by the user.
     * @param {Options} options - Command options.
     * @param {string} altText - Alternative text.
     * @param {string} altKey - Alternative key.
     * @returns {Promise<number>}
     */
    async resolve(options: Options, altText?: string, altKey?: string): Promise<number> {
        const choices = [
            {title: 'AllowMosaic', value: AccountRestrictionFlags.AllowMosaic},
            {title: 'BlockMosaic', value: AccountRestrictionFlags.BlockMosaic},
        ]
        const value = +(await OptionsChoiceResolver(options,
            altKey ? altKey : 'flags',
            altText ? altText : 'Select the restriction flags:',
            choices,
            'select',
            new AccountRestrictionFlagsValidator()
        ))
        return value
    }
}

/**
 * Restriction account operation flags resolver
 */
export class RestrictionAccountOperationFlagsResolver implements Resolver {

    /**
     * Resolves a restriction account operation flag provided by the user.
     * @param {Options} options - Command options.
     * @param {string} altText - Alternative text.
     * @param {string} altKey - Alternative key.
     * @returns {Promise<number>}
     */
    async resolve(options: Options, altText?: string, altKey?: string): Promise<number> {
        const choices = [
            {title: 'AllowOutgoingTransactionType', value: AccountRestrictionFlags.AllowOutgoingTransactionType},
            {title: 'BlockOutgoingTransactionType', value: AccountRestrictionFlags.BlockOutgoingTransactionType},
        ]
        const value = +(await OptionsChoiceResolver(options,
            altKey ? altKey : 'flags',
            altText ? altText : 'Select the restriction flags:',
            choices,
            'select',
            new AccountRestrictionFlagsValidator()
        ))
        return value
    }
}
