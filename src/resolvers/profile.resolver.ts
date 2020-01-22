import {ProfileOptions} from '../commands/profile.command';
import {Profile} from '../models/profile';
import {OptionsResolver} from '../options-resolver';
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
    async resolve(options: ProfileOptions, secondSource?: Profile, altText?: string): Promise<string> {
        return await OptionsResolver(options,
            'profile',
            () => undefined,
            'Enter a profile name: ');
    }
}
