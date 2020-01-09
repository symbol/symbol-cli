import chalk from 'chalk';
import {Address} from 'nem2-sdk';
import {Profile} from '../model/profile';
import {OptionsResolver} from '../options-resolver';
import {ProfileOptions} from '../profile.command';
import {AccountService} from '../service/account.service';
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
     * @returns {Address}
     */
    async resolve(options: ProfileOptions, secondSource?: Profile, altText?: string): Promise<any> {
        const resolution = await OptionsResolver(options,
            'address',
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

/**
 * Recipient address resolver
 */
export class RecipientAddressResolver implements Resolver {

    /**
     * Resolves a recipient address provided by the user.
     * @param {ProfileOptions} options - Command options.
     * @param {Profile} secondSource - Secondary data source.
     * @param {string} altText - Alternative text.
     * @returns {Address}
     */
    async resolve(options: ProfileOptions, secondSource?: Profile, altText?: string): Promise<any> {
        const resolution = await OptionsResolver(options,
            'recipientAddress',
            () => undefined,
            altText ? altText : 'Enter the recipient address or alias: ');
        try {
            new AddressAliasValidator().validate(resolution);
        } catch (err) {
            console.log(chalk.red('ERR'), err);
            return process.exit();
        }
        return AccountService.getRecipient(resolution);
    }
}
