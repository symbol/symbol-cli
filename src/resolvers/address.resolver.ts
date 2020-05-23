/*
 *
 * Copyright 2018-present NEM
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
import { Options } from 'clime';
import { Address, NamespaceId } from 'symbol-sdk';

import { ProfileOptions } from '../interfaces/profile.options';
import { Profile } from '../models/profile.model';
import { OptionsResolver } from '../options-resolver';
import { AccountService } from '../services/account.service';
import { AddressAliasValidator, AddressValidator } from '../validators/address.validator';
import { Resolver } from './resolver';

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
        const resolution = await OptionsResolver(
            options,
            altKey ? altKey : 'address',
            () => (secondSource ? secondSource.address.pretty() : undefined),
            altText ? altText : 'Enter an address:',
            'text',
            new AddressValidator(),
        );
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
     * @returns {Promise<Address | NamespaceId>}
     */
    async resolve(options: ProfileOptions, secondSource?: Profile, altText?: string, altKey?: string): Promise<Address | NamespaceId> {
        const resolution = await OptionsResolver(
            options,
            altKey ? altKey : 'address',
            () => (secondSource ? secondSource.address.pretty() : undefined),
            altText ? altText : 'Enter an address (or @alias):',
            'text',
            new AddressAliasValidator(),
        );
        return AccountService.getRecipient(resolution);
    }
}
