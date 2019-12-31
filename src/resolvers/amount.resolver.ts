import {UInt64} from 'nem2-sdk';
import {Profile} from '../model/profile';
import {OptionsResolver} from '../options-resolver';
import {ProfileOptions} from '../profile.command';
import {NumericStringValidator} from '../validators/numericString.validator';
import {Resolver} from './resolver';

/**
 * Amount resolver
 */
export class AmountResolver implements Resolver {

    /**
     * Resolves an absolute amount by the user.
     * @param {ProfileOptions} options - Command options.
     * @param {Profile} secondSource - Secondary data source.
     * @param {string} altText - Alternative text.
     * @returns {UInt64}
     */
    resolve(options: ProfileOptions, secondSource?: Profile, altText?: string): any {
        const resolution = OptionsResolver(options,
        'amount',
        () =>  undefined,
        altText ? altText : 'Enter an absolute amount: ').trim();
        new NumericStringValidator().validate(resolution);
        return UInt64.fromNumericString(resolution);
    }
}
