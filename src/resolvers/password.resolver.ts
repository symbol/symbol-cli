import {Password} from 'nem2-sdk';
import {Profile} from '../model/profile';
import {OptionsPasswordResolver} from '../options-resolver';
import {ProfileOptions} from '../profile.command';
import {PasswordValidator} from '../validators/password.validator';
import {Resolver} from './resolver';

/**
 * Password resolver
 */
export class PasswordResolver implements Resolver {

    /**
     * Resolves a password provided by the user.
     * @param {ProfileOptions} options - Command options.
     * @param {Profile} secondSource - Secondary data source.
     * @param {string} altText - Alternative text.
     * @returns {Password}
     */
    resolve(options: ProfileOptions, secondSource?: Profile, altText?: string): any {
        const resolution = OptionsPasswordResolver(options,
            'password',
            () => undefined,
            'Enter your wallet password: ');
        new PasswordValidator().validate(resolution);
        return new Password(resolution);
    }
}
