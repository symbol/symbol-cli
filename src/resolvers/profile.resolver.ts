import {Password} from 'nem2-sdk';
import {Profile} from '../model/profile';
import {OptionsPasswordResolver, OptionsResolver} from '../options-resolver';
import {ProfileOptions} from '../profile.command';
import {PasswordValidator} from '../validators/password.validator';
import {Resolver} from './resolver';

/**
 * Profile name resolver
 */
export class ProfileNameResolver implements Resolver {

    /**
     * Resolves a profile name provided by the user.
     * @param {ProfileOptions} options - Command options.
     * @param {Profile} secondSource - Secondary data source.
     * @param {string} altText - Alternative text.
     * @returns {string}
     */
    resolve(options: ProfileOptions, secondSource?: Profile, altText?: string): any {
        const resolution = OptionsResolver(options,
            'profile',
            () => undefined,
            'Enter profile name: ').trim();
        return resolution;
    }
}
