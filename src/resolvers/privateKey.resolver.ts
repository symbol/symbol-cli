import {Password} from 'nem2-sdk';
import {Profile} from '../model/profile';
import {OptionsPasswordResolver} from '../options-resolver';
import {ProfileOptions} from '../profile.command';
import {PasswordValidator} from '../validators/password.validator';
import {Resolver} from './resolver';
import {PrivateKeyValidator} from '../validators/privateKey.validator';

/**
 * Private key resolver
 */
export class PrivateKeyResolver implements Resolver {

    /**
     * Resolves a private key provided by the user.
     * @param {ProfileOptions} options - Command options.
     * @param {Profile} secondSource - Secondary data source.
     * @param {string} altText - Alternative text.
     * @returns {Password}
     */
    resolve(options: ProfileOptions, secondSource?: Profile, altText?: string): any {
        const resolution = OptionsPasswordResolver(options,
            'privateKey',
            () => undefined,
            'Enter your private key: ').trim();
        new PrivateKeyValidator().validate(resolution);
        return resolution;
    }
}
