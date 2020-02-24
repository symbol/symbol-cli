import {NetworkType} from 'symbol-sdk'
import {isNumeric} from 'rxjs/internal-compatibility'
import {ProfileOptions} from '../interfaces/profile.command'
import {Profile} from '../models/profile'
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
     * @param {Profile} secondSource - Secondary data source.
     * @param {string} altText - Alternative text.
     * @returns {number}
     */
    resolve(options: ProfileOptions, secondSource?: Profile, altText?: string): number {
        const choices = ['MAIN_NET', 'TEST_NET', 'MIJIN', 'MIJIN_TEST']
        const resolution = OptionsChoiceResolver(options,
            'network',
            altText ? altText : 'Select the network type: ',
            choices,
        )
        let networkFriendlyName
        if (isNumeric(resolution)) {
            networkFriendlyName = choices[+resolution] as any
        } else {
            networkFriendlyName = resolution
        }
        new NetworkValidator().validate(networkFriendlyName)
        return parseInt(NetworkType[networkFriendlyName], 10)
    }
}
