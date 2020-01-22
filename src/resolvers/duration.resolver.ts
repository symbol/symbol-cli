import {UInt64} from 'nem2-sdk';
import {ProfileOptions} from '../commands/profile.command';
import {Profile} from '../models/profile';
import {OptionsResolver} from '../options-resolver';
import {NumericStringValidator} from '../validators/numericString.validator';
import {Resolver} from './resolver';

/**
 * Duration resolver
 */
export class DurationResolver implements Resolver {

    /**
     * Resolves a duration by the user.
     * @param {ProfileOptions} options - Command options.
     * @param {Profile} secondSource - Secondary data source.
     * @param {string} altText - Alternative text.
     * @returns {UInt64}
     */
    resolve(options: ProfileOptions, secondSource?: Profile, altText?: string): any {
        const resolution = OptionsResolver(options,
        'duration',
        () =>  undefined,
        altText ? altText : 'Enter the duration in number of blocks: ').trim();
        new NumericStringValidator().validate(resolution);
        return UInt64.fromNumericString(resolution);
    }
}
