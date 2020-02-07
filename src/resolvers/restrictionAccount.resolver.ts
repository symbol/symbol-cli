import chalk from 'chalk'
import {AccountRestrictionFlags} from 'nem2-sdk'
import {ProfileOptions} from '../interfaces/profile.command'
import {Profile} from '../models/profile'
import {OptionsChoiceResolver} from '../options-resolver'
import {Resolver} from './resolver'
import {AccountRestrictionFlagsValidator} from '../validators/restrictionType.validator'

/**
 * Restriction account address flags resolver
 */
export class RestrictionAccountAddressFlagsResolver implements Resolver {

    /**
     * Resolves a restriction account address flag provided by the user.
     * @param {ProfileOptions} options - Command options.
     * @param {Profile} secondSource - Secondary data source.
     * @param {string} altText - Alternative text.
     * @param {string} altKey - Alternative key.
     * @returns {Promise<number>}
     */
    async resolve(options: ProfileOptions, secondSource?: Profile, altText?: string, altKey?: string): Promise<number> {
        const choices = [
            {title: 'AllowOutgoingAddress', value: AccountRestrictionFlags.AllowOutgoingAddress},
            {title: 'BlockOutgoingAddress', value: AccountRestrictionFlags.BlockOutgoingAddress},
            {title: 'AllowIncomingAddress', value: AccountRestrictionFlags.AllowIncomingAddress},
            {title: 'BlockIncomingAddress', value: AccountRestrictionFlags.BlockIncomingAddress},
        ]
        const index = +(await OptionsChoiceResolver(options,
            altKey ? altKey : 'flags',
            altText ? altText : 'Select the restriction flags: ',
            choices,
        ))
        try {
            new AccountRestrictionFlagsValidator().validate(index)
        } catch (err) {
            console.log(chalk.red('ERR'), err)
            return process.exit()
        }
        return index
    }
}

/**
 * Restriction account mosaic flags resolver
 */
export class RestrictionAccountMosaicFlagsResolver implements Resolver {

    /**
     * Resolves a restriction account mosaic flag provided by the user.
     * @param {ProfileOptions} options - Command options.
     * @param {Profile} secondSource - Secondary data source.
     * @param {string} altText - Alternative text.
     * @param {string} altKey - Alternative key.
     * @returns {Promise<number>}
     */
    async resolve(options: ProfileOptions, secondSource?: Profile, altText?: string, altKey?: string): Promise<number> {
        const choices = [
            {title: 'AllowMosaic', value: AccountRestrictionFlags.AllowMosaic},
            {title: 'BlockMosaic', value: AccountRestrictionFlags.BlockMosaic},
        ]
        const index = +(await OptionsChoiceResolver(options,
            altKey ? altKey : 'flags',
            altText ? altText : 'Select the restriction flags: ',
            choices,
        ))
        try {
            new AccountRestrictionFlagsValidator().validate(index)
        } catch (err) {
            console.log(chalk.red('ERR'), err)
            return process.exit()
        }
        return index
    }
}

/**
 * Restriction account operation flags resolver
 */
export class RestrictionAccountOperationFlagsResolver implements Resolver {

    /**
     * Resolves a restriction account operation flag provided by the user.
     * @param {ProfileOptions} options - Command options.
     * @param {Profile} secondSource - Secondary data source.
     * @param {string} altText - Alternative text.
     * @param {string} altKey - Alternative key.
     * @returns {Promise<number>}
     */
    async resolve(options: ProfileOptions, secondSource?: Profile, altText?: string, altKey?: string): Promise<number> {
        const choices = [
            {title: 'AllowOutgoingTransactionType', value: AccountRestrictionFlags.AllowOutgoingTransactionType},
            {title: 'BlockOutgoingTransactionType', value: AccountRestrictionFlags.BlockOutgoingTransactionType},
        ]
        const index = +(await OptionsChoiceResolver(options,
            altKey ? altKey : 'flags',
            altText ? altText : 'Select the restriction flags: ',
            choices,
        ))
        try {
            new AccountRestrictionFlagsValidator().validate(index)
        } catch (err) {
            console.log(chalk.red('ERR'), err)
            return process.exit()
        }
        return index
    }
}
