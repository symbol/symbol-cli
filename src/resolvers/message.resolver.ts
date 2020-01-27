import {ProfileOptions} from '../interfaces/profile.command';
import {Profile} from '../models/profile';
import {OptionsResolver} from '../options-resolver';
import {Resolver} from './resolver';

/**
 * Message resolver
 */
export class MessageResolver implements Resolver {

    /**
     * Resolves a message provided by the user.
     * @param {ProfileOptions} options - Command options.
     * @param {Profile} secondSource - Secondary data source.
     * @param {string} altText - Alternative text.
     * @returns {string}
     */
    resolve(options: ProfileOptions, secondSource?: Profile, altText?: string): string {
        const resolution = OptionsResolver(options,
        'message',
        () =>  undefined,
        'Enter a message: ');
        return resolution;
    }
}
