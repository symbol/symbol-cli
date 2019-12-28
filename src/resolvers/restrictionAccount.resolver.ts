import {AccountRestrictionFlags} from 'nem2-sdk';
import {Profile} from '../model/profile';
import {OptionsChoiceResolver} from '../options-resolver';
import {ProfileOptions} from '../profile.command';
import {Resolver} from './resolver';

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
    resolve(options: ProfileOptions, secondSource?: Profile, altText?: string): any {
        const choices = ['AllowOutgoingAddress', 'AllowIncomingAddress', 'BlockOutgoingAddress', 'BlockIncomingAddress'];
        const index = +OptionsChoiceResolver(options,
            'flags',
            altText ? altText : 'Select the restriction flags: ',
            choices,
        );
        return AccountRestrictionFlags[choices[index] as any];
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
    resolve(options: ProfileOptions, secondSource?: Profile, altText?: string): any {
        const choices = ['AllowMosaic', 'BlockMosaic'];
        const index = +OptionsChoiceResolver(options,
            'flags',
            altText ? altText : 'Select the restriction flags: ',
            choices,
        );
        return AccountRestrictionFlags[choices[index] as any];
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
    resolve(options: ProfileOptions, secondSource?: Profile, altText?: string): any {
        const choices = ['AllowOutgoingTransactionType', 'BlockOutgoingTransactionType'];
        const index = +OptionsChoiceResolver(options,
            'flags',
            altText ? altText : 'Select the restriction flags: ',
            choices,
        );
        return AccountRestrictionFlags[choices[index] as any];
    }
}
