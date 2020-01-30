import * as readlineSync from 'readline-sync'
import {CommandOptions} from '../commands/account/generate'
import {Profile} from '../models/profile'
import {Resolver} from './resolver'

/**
 * Save resolver
 */
export class SaveResolver implements Resolver {

    /**
     * Resolves if the account has to be saved.
     * @param {CommandOptions} options - Command options.
     * @param {Profile} secondSource - Secondary data source.
     * @param {string} altText - Alternative text.
     * @returns {boolean}
     */
    resolve(options: CommandOptions, secondSource?: Profile, altText?: string): boolean {
        if (!options.save && readlineSync.keyInYN('Do you want to save the account?')) {
            options.save = true
        }
        return options.save
    }
}
