import {Address, NamespaceId} from 'nem2-sdk';
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
     * @param {string} altKey - Alternative key.
     * @returns {Address}
     */
    resolve(options: ProfileOptions, secondSource?: Profile, altText?: string, altKey?: string): any {
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
     * @returns {Address}
     */
    resolve(options: ProfileOptions, secondSource?: Profile, altText?: string, altKey?: string): any {
        const resolution = OptionsResolver(options,
            altKey ? altKey : 'address',
            () => secondSource ? secondSource.address.pretty() : undefined,
            altText ? altText : 'Enter an address (or @alias): ').trim();
        new AddressAliasValidator().validate(resolution);
        return AccountService.getRecipient(resolution);
    }
}
