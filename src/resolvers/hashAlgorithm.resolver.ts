import {Profile} from '../model/profile';
import {OptionsChoiceResolver} from '../options-resolver';
import {ProfileOptions} from '../profile.command';
import {HashAlgorithmValidator} from '../validators/hashAlgorithm.validator';
import {Resolver} from './resolver';

/**
 * Link hashAlgorithm resolver
 */
export class HashAlgorithmResolver implements Resolver {

    /**
     * Resolves an hashAlgorithm provided by the user.
     * @param {ProfileOptions} options - Command options.
     * @param {Profile} secondSource - Secondary data source.
     * @param {string} altText - Alternative text.
     * @returns {number}
     */
    resolve(options: ProfileOptions, secondSource?: Profile, altText?: string): any {
        const choices = ['Op_Sha3_256', 'Op_Keccak_256', 'Op_Hash_160', 'Op_Hash_256'];
        const index = +OptionsChoiceResolver(options,
        'hashAlgorithm',
            altText ? altText : 'Select the algorithm used to hash the proof: ',
        choices,
        );
        new HashAlgorithmValidator().validate(index);
        return index;
    }
}
