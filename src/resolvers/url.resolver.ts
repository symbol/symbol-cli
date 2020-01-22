import {ProfileOptions} from '../commands/profile.command';
import {Profile} from '../models/profile';
import {OptionsResolver} from '../options-resolver';
import {Resolver} from './resolver';

/**
 * URL resolver
 */
export class URLResolver implements Resolver {

    /**
     * Resolves an url provided by the user.
     * @param {ProfileOptions} options - Command options.
     * @param {Profile} secondSource - Secondary data source.
     * @param {string} altText - Alternative text.
     * @returns {string}
     */
    async resolve(options: ProfileOptions, secondSource?: Profile, altText?: string): Promise<string> {
        const resolution = await OptionsResolver(options,
            'url',
            () => secondSource ? secondSource.url : undefined,
            altText ? altText : 'Enter the NEM2 node URL. (Example: http://localhost:3000): ');
        return resolution;
    }
}
