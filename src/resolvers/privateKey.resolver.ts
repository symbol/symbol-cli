import {Password} from 'nem2-sdk';
import {ProfileOptions} from '../interfaces/profile.command';
import {Profile} from '../models/profile';
import {OptionsResolver} from '../options-resolver';
import {PrivateKeyValidator} from '../validators/privateKey.validator';
import {Resolver} from './resolver';

/**
 * Private key resolver
 */
export class PrivateKeyResolver implements Resolver {

    /**
     * Resolves a private key provided by the user.
     * @param {ProfileOptions} options - Command options.
     * @param {Profile} secondSource - Secondary data source.
     * @param {string} altText - Alternative text.
     * @returns {string}
     */
    resolve(options: ProfileOptions, secondSource?: Profile, altText?: string): string {
        const resolution = OptionsResolver(options,
            'privateKey',
            () => undefined,
            'Enter your account private key: ',
            undefined,
            true).trim();
        new PrivateKeyValidator().validate(resolution);
        return resolution;
    }
}
