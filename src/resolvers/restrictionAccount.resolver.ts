import {ExpectedError} from 'clime'
import {AccountRestrictionFlags} from 'symbol-sdk'
import {ProfileOptions} from '../interfaces/profile.command'
import {Profile} from '../models/profile'
import {OptionsChoiceResolver} from '../options-resolver'
import {BinaryValidator} from '../validators/binary.validator'
import {Resolver} from './resolver'

/**
 * Restriction account address flags resolver
 */
export class RestrictionAccountAddressFlagsResolver implements Resolver {

    /**
     * Resolves a restriction account address flag provided by the user.
     * @param {ProfileOptions} options - Command options.
     * @param {Profile} secondSource - Secondary data source.
     * @param {string} altText - Alternative text.
     * @returns {number}
     */
    resolve(options: ProfileOptions, secondSource?: Profile, altText?: string): number {
        const choices = ['AllowOutgoingAddress', 'BlockOutgoingAddress', 'AllowIncomingAddress', 'BlockIncomingAddress']
        const index = +OptionsChoiceResolver(options,
            'flags',
            altText ? altText : 'Select the restriction flags: ',
            choices,
        )
        if (index < 0 || index > 3) {
            throw new ExpectedError('Unknown restriction flag.')
        }
        return parseInt(AccountRestrictionFlags[choices[index] as any], 10)
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
     * @returns {number}
     */
    resolve(options: ProfileOptions, secondSource?: Profile, altText?: string): number {
        const choices = ['AllowMosaic', 'BlockMosaic']
        const index = +OptionsChoiceResolver(options,
            'flags',
            altText ? altText : 'Select the restriction flags: ',
            choices,
        )
        new BinaryValidator().validate(index)
        return parseInt(AccountRestrictionFlags[choices[index] as any], 10)
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
     * @returns {number}
     */
    resolve(options: ProfileOptions, secondSource?: Profile, altText?: string): number {
        const choices = ['AllowOutgoingTransactionType', 'BlockOutgoingTransactionType']
        const index = +OptionsChoiceResolver(options,
            'flags',
            altText ? altText : 'Select the restriction flags: ',
            choices,
        )
        new BinaryValidator().validate(index)
        return parseInt(AccountRestrictionFlags[choices[index] as any], 10)
    }
}
