import * as readlineSync from 'readline-sync';
import {CommandOptions} from '../commands/account/generate';
import {Profile} from '../models/profile';
import {Resolver} from './resolver';

/**
 * Save resolver
 */
export class SaveResolver implements Resolver {

    /**
     * Resolves an action provided by the user.
     * @param {CommandOptions} options - Command options.
     * @param {Profile} secondSource - Secondary data source.
     * @param {string} altText - Alternative text.
     * @returns {number}
     */
    resolve(options: CommandOptions, secondSource?: Profile, altText?: string): any {
        if (!options.save && readlineSync.keyInYN('Do you want to save the account?')) {
            options.save = true;
        }
        return options.save;
    }
}
