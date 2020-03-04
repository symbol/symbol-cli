import chalk from 'chalk'
import {NetworkType} from 'symbol-sdk'
import {ProfileOptions} from '../interfaces/profile.command'
import {ProfileModel} from '../models/profile.model'
import {OptionsChoiceResolver} from '../options-resolver'
import {NetworkValidator} from '../validators/network.validator'
import {Resolver} from './resolver'

/**
 * Restriction account address flags resolver
 */
export class NetworkResolver implements Resolver {

    /**
     * Resolves a network type provided by the user.
     * @param {ProfileOptions} options - Command options.
     * @param {ProfileModel} secondSource - Secondary data source.
     * @param {string} altText - Alternative text.
     * @param {string} altKey - Alternative key.
     * @returns {Promise<any>}
     */
    async resolve(options: ProfileOptions, secondSource?: ProfileModel, altText?: string, altKey?: string): Promise<any> {
        const choices = [
            {title: 'MAIN_NET', value: NetworkType.MAIN_NET},
            {title: 'TEST_NET', value: NetworkType.TEST_NET},
            {title: 'MIJIN', value: NetworkType.MIJIN},
            {title: 'MIJIN_TEST', value: NetworkType.MIJIN_TEST},
        ]
        const value = +(await OptionsChoiceResolver(
            options,
            altKey ? altKey : 'network',
            altText ? altText : 'Select the network type: ',
            choices,
            'select',
            new NetworkValidator()
        ))
        return value
    }
}
