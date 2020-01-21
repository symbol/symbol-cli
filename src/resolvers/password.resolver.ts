import {Password} from 'nem2-sdk';
import {ProfileOptions} from '../commands/profile.command';
import {Profile} from '../models/profile';
import {OptionsResolver} from '../options-resolver';
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
        const resolution = OptionsResolver(options,
            'password',
            () => undefined,
            'Enter your wallet password: ',
            undefined,
            true);
        new PasswordValidator().validate(resolution);
        return new Password(resolution);
    }
}
