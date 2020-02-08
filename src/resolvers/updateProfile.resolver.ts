import chalk from 'chalk'
import {ProfileOptions} from '../interfaces/profile.command'
import {Profile} from '../models/profile'
import {OptionsResolver} from '../options-resolver'
import {TransactionTypeValidator} from '../validators/transactionType.validator'
import {Resolver} from './resolver'
import {OptionsChoiceResolver} from '../options-resolver'
import {UpdateProfileAction} from '../interfaces/updateProfile.resolver'

/**
 * Update options resolver
 */
export class UpdateProfileOptionsResolver implements Resolver {

    /**
     * Choose the options when updating profile.
     * @param {ProfileOptions} options - Command options.
     * @param {Profile} secondSource - Secondary data source.
     * @param {string} altText - Alternative text.
     * @param {string} altKey - Alternative key.
     * @returns {Promise<number>}
     */
    async resolve(options: ProfileOptions, secondSource?: Profile, altText?: string, altKey?: string): Promise<UpdateProfileAction[]> {
        const choices = [
            {title: 'Name', value: UpdateProfileAction.Name},
            {title: 'Url', value: UpdateProfileAction.Url},
        ]
        const resolution = await OptionsChoiceResolver(options,
            altKey ? altKey : 'updateOptions',
            altText ? altText : 'Select the network type: ',
            choices,
            'multiselect'
        )
        return resolution
    }
}
