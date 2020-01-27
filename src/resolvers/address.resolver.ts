import {Address, NamespaceId} from 'nem2-sdk';
import {ProfileOptions} from '../interfaces/profile.command';
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
    resolve(options: ProfileOptions, secondSource?: Profile, altText?: string, altKey?: string): Address {
        const resolution = OptionsResolver(options,
            altKey ? altKey : 'address',
            () => secondSource ? secondSource.address.pretty() : undefined,
            altText ? altText : 'Enter an address: ').trim();
        new AddressValidator().validate(resolution);
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
     * @returns {Address | NamespaceId}
     */
    resolve(options: ProfileOptions, secondSource?: Profile, altText?: string, altKey?: string): Address | NamespaceId {
        const resolution = OptionsResolver(options,
            altKey ? altKey : 'address',
            () => secondSource ? secondSource.address.pretty() : undefined,
            altText ? altText : 'Enter an address (or @alias): ').trim();
        new AddressAliasValidator().validate(resolution);
        return AccountService.getRecipient(resolution);
    }
}
