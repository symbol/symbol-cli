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
import { NetworkType, PublicAccount } from 'symbol-sdk';

import { Profile } from '../models/profile.model';
import { OptionsChoiceResolver, OptionsResolver } from '../options-resolver';
import { PublicKeyValidator, PublicKeysValidator } from '../validators/publicKey.validator';
import { Resolver } from './resolver';

/**
 * Public key resolver
 */
export class PublicKeyResolver implements Resolver {
    /**
     * Resolves a public key provided by the user.
     * @param {Options} options - Command options.
     * @param {NetworkType} secondSource - Secondary data source.
     * @param {string} altText - Alternative text.
     * @param {string} altKey - Alternative key.
     * @returns {Promise<PublicAccount>}
     */
    async resolve(options: Options, secondSource?: NetworkType, altText?: string, altKey?: string): Promise<PublicAccount> {
        const resolution = await OptionsResolver(
            options,
            altKey ? altKey : 'publicKey',
            () => undefined,
            altText ? altText : 'Enter the account public key:',
            'text',
            new PublicKeyValidator(),
        );
        return PublicAccount.createFromPublicKey(resolution, secondSource ? secondSource : NetworkType.MIJIN_TEST);
    }
}

/**
 * Cosignatory public key resolver
 */

export class CosignatoryPublicKeyResolver implements Resolver {
    /**
     * Resolves a set of cosignatory public keys provided by the user.
     * @param {Options} options - Command options.
     * @param {Profile} secondSource - Secondary data source.
     * @param {string} altText - Alternative text.
     * @param {string} altKey - Alternative key.
     * @returns {Promise<PublicAccount[]>}
     */
    async resolve(options: Options, secondSource?: Profile, altText?: string, altKey?: string): Promise<PublicAccount[]> {
        const resolution = await OptionsResolver(
            options,
            altKey ? altKey : 'cosignatoryPublicKey',
            () => undefined,
            altText ? altText : 'Enter the cosignatory accounts public keys (separated by a comma):',
            'text',
            new PublicKeysValidator(),
        );
        const cosignatoryPublicKeys = resolution.split(',');
        const cosignatories: PublicAccount[] = [];
        cosignatoryPublicKeys.map((cosignatory: string) => {
            cosignatories.push(
                PublicAccount.createFromPublicKey(cosignatory, secondSource ? secondSource.networkType : NetworkType.MIJIN_TEST),
            );
        });
        return cosignatories;
    }
}

export class PublicKeyChoiceResolver implements Resolver {
    /**
     * Resolves a public key from a list of public keys
     * @param {string[]} publicKeys
     * @returns {Promise<number>}
     */
    async resolve(publicKeys: string[]): Promise<string> {
        const choices = publicKeys.map((string) => ({ title: string, value: string }));

        return OptionsChoiceResolver({}, 'signer', 'Chose signer:', choices, 'select', undefined);
    }
}
