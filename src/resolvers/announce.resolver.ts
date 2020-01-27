import * as readlineSync from 'readline-sync';
import {AnnounceTransactionsOptions} from '../interfaces/announce.transactions.command';
import {CreateProfileOptions} from '../interfaces/create.profile.command';
import {Profile} from '../models/profile';
import {Resolver} from './resolver';

/**
 * Announce resolver
 */
export class AnnounceResolver implements Resolver {

    /**
     * Resolves if the user wants to announce the transaction.
     * @param {CreateProfileOptions} options - Command options.
     * @param {Profile} secondSource - Secondary data source.
     * @param {string} altText - Alternative text.
     * @returns {boolean}
     */
    resolve(options: AnnounceTransactionsOptions, secondSource?: Profile, altText?: string): boolean {
        if (!options.announce && readlineSync.keyInYN('Do you want to announce this transaction?')) {
            options.announce = true;
        }
        return options.announce;
    }
}
