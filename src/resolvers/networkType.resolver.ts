import {NetworkType} from 'nem2-sdk';
import {Profile} from '../model/profile';
import {OptionsChoiceResolver} from '../options-resolver';
import {ProfileOptions} from '../profile.command';
import {NetworkValidator} from '../validators/network.validator';
import {Resolver} from './resolver';

/**
 * Restriction account address flags resolver
 */
export class NetworkTypeResolver implements Resolver {

    /**
     * Resolves a network type provided by the user.
     * @param {ProfileOptions} options - Command options.
     * @param {Profile} secondSource - Secondary data source.
     * @param {string} altText - Alternative text.
     * @returns {number}
     */
    async resolve(options: ProfileOptions, secondSource?: Profile, altText?: string): Promise<any> {
        const choices = [
            {title: 'MAIN_NET', value: 0},
            {title: 'TEST_NET', value: 1},
            {title: 'MIJIN', value: 2},
            {title: 'MIJIN_TEST', value: 3},
        ];
        const index = +(await OptionsChoiceResolver(options,
            'network',
            altText ? altText : 'Select the network type: ',
            choices,
        ));
        const networkFriendlyName = choices[index] as any;
        new NetworkValidator().validate(networkFriendlyName);
        return NetworkType[networkFriendlyName];
    }
}
