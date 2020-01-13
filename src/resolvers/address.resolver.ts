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
    resolve(options: ProfileOptions, secondSource?: Profile, altText?: string): any {
        const resolution = OptionsResolver(options,
            'address',
            () => secondSource ? secondSource.address.pretty() : undefined,
            altText ? altText : 'Enter an address: ').trim();
        new AddressValidator().validate(resolution);
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
    resolve(options: ProfileOptions, secondSource?: Profile, altText?: string): any {
        const resolution = OptionsResolver(options,
            'recipientAddress',
            () => undefined,
            altText ? altText : 'Enter the recipient address or @alias: ').trim();
        new AddressAliasValidator().validate(resolution);
        return AccountService.getRecipient(resolution);
    }
}
