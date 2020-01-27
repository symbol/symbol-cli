import {HashType} from 'nem2-sdk';
import {isNumeric} from 'rxjs/internal-compatibility';
import {ProfileOptions} from '../interfaces/profile.command';
import {Profile} from '../models/profile';
import {OptionsChoiceResolver} from '../options-resolver';
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
        const resolution = OptionsChoiceResolver(options,
        'hashAlgorithm',
            altText ? altText : 'Select the algorithm used to hash the proof: ',
        choices,
        );
        let hashAlgorithmName;
        if (isNumeric(resolution)) {
            hashAlgorithmName = choices[+resolution] as any;
        } else {
            hashAlgorithmName = resolution;
        }
        new HashAlgorithmValidator().validate(hashAlgorithmName);
        return HashType[hashAlgorithmName];
    }
}
