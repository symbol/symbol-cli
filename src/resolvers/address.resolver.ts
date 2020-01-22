import chalk from 'chalk';
import {Address} from 'nem2-sdk';
import {ProfileOptions} from '../commands/profile.command';
import {Profile} from '../models/profile';
import {OptionsResolver} from '../options-resolver';
import {AccountService} from '../services/account.service';
import {AddressAliasValidator, AddressValidator} from '../validators/address.validator';
import {Resolver} from './resolver';

/**
 * Address resolver
 */
export class AddressResolver implements Resolver {

    /**
     * Resolves an address provided by the user.
     * @param {ProfileOptions} options - Command options.
     * @param {Profile} secondSource - Secondary data source.
     * @param {string} altText - Alternative text.
     * @param {string} altKey - Alternative key.
     * @returns {Address}
     */
    async resolve(options: ProfileOptions, secondSource?: Profile, altText?: string, altKey?: string): Promise<any> {
        const resolution = await OptionsResolver(options,
            altKey ? altKey : 'address',
            () => secondSource ? secondSource.address.pretty() : undefined,
            altText ? altText : 'Enter an address: ');
        try {
            new AddressValidator().validate(resolution);
        } catch (err) {
            console.log(chalk.red('ERR'), err);
            return process.exit();
        }
        return Address.createFromRawAddress(resolution);
    }
}

export class AddressAliasResolver implements Resolver {
    /**
     * Resolves an address provided by the user.
     * @param {ProfileOptions} options - Command options.
     * @param {Profile} secondSource - Secondary data source.
     * @param {string} altText - Alternative text.
     * @param {string} altKey - Alternative key.
     * @returns {Address}
     */
    async resolve(options: ProfileOptions, secondSource?: Profile, altText?: string, altKey?: string): Promise<any> {
        const resolution = (await OptionsResolver(options,
            altKey ? altKey : 'address',
            () => secondSource ? secondSource.address.pretty() : undefined,
            altText ? altText : 'Enter an address (or @alias): ')).trim();
        try {
            new AddressAliasValidator().validate(resolution);
        } catch (err) {
            console.log(chalk.red('ERR'), err);
            return process.exit();
        }
        return AccountService.getRecipient(resolution);
    }
}
