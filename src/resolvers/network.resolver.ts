import {NetworkType} from 'nem2-sdk';
import {isNumeric} from 'rxjs/internal-compatibility';
import {Profile} from '../model/profile';
import {OptionsChoiceResolver} from '../options-resolver';
import {ProfileOptions} from '../profile.command';
import {NetworkValidator} from '../validators/network.validator';
import {Resolver} from './resolver';

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
    resolve(options: ProfileOptions, secondSource?: Profile, altText?: string): any {
        const choices = ['MAIN_NET', 'TEST_NET', 'MIJIN', 'MIJIN_TEST'];
        const resolution = OptionsChoiceResolver(options,
            'network',
            altText ? altText : 'Select the network type: ',
            choices,
        );
        let networkFriendlyName;
        if (isNumeric(resolution)) {
            networkFriendlyName = choices[+resolution] as any;
        } else {
            networkFriendlyName = resolution;
        }
        new NetworkValidator().validate(networkFriendlyName);
        return NetworkType[networkFriendlyName];
    }
}
