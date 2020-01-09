import chalk from 'chalk';
import {UInt64} from 'nem2-sdk';
import {Profile} from '../model/profile';
import {OptionsResolver} from '../options-resolver';
import {ProfileOptions} from '../profile.command';
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
    async resolve(options: ProfileOptions, secondSource?: Profile, altText?: string): Promise<UInt64> {
        const resolution = await OptionsResolver(options,
        'duration',
        () =>  undefined,
        altText ? altText : 'Enter the duration in number of blocks: ');
        try {
            new NumericStringValidator().validate(resolution);
        } catch (err) {
            console.log(chalk.red('ERR'), err);
            return process.exit();
        }
        return UInt64.fromNumericString(resolution);
    }
}
