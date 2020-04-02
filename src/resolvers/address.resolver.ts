import {ProfileOptions} from '../interfaces/profile.options'
import {Profile} from '../models/profile.model'
import {OptionsResolver} from '../options-resolver'
import {AccountService} from '../services/account.service'
import {AddressAliasValidator, AddressValidator} from '../validators/address.validator'
import {Resolver} from './resolver'
import {Address, NamespaceId} from 'symbol-sdk'
import {Options} from 'clime'

/**
 * Address resolver
 */
export class AddressResolver implements Resolver {

    /**
     * Resolves an address provided by the user.
     * @param {Options} options - Command options.
     * @param {Profile} secondSource - Secondary data source.
     * @param {string} altText - Alternative text.
     * @param {string} altKey - Alternative key.
     * @returns {Promise<Address>}
     */
    async resolve(options: Options, secondSource?: Profile, altText?: string, altKey?: string): Promise<Address> {
        const resolution = await OptionsResolver(options,
            altKey ? altKey : 'address',
            () => secondSource ? secondSource.address.pretty() : undefined,
            altText ? altText : 'Enter an address:',
            'text',
            new AddressValidator())
        return Address.createFromRawAddress(resolution)
    }
}

export class AddressAliasResolver implements Resolver {
    /**
     * Resolves an address provided by the user.
     * @param {ProfileOptions} options - Command options.
     * @param {Profile} secondSource - Secondary data source.
     * @param {string} altText - Alternative text.
     * @param {string} altKey - Alternative key.
     * @returns {Promise<Address | NamespaceId>}
     */
    async resolve(options: ProfileOptions, secondSource?: Profile, altText?: string, altKey?: string): Promise<Address | NamespaceId> {
        const resolution = await OptionsResolver(options,
            altKey ? altKey : 'address',
            () => secondSource ? secondSource.address.pretty() : undefined,
            altText ? altText : 'Enter an address (or @alias):',
            'text',
            new AddressAliasValidator())
        return AccountService.getRecipient(resolution)
    }
}
