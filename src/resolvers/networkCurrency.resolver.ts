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

import { ExpectedError } from 'clime';
import { BlockHttp, QueryParams, UInt64 } from 'symbol-sdk';

import { CreateProfileOptions } from '../interfaces/createProfile.options';
import { NetworkCurrency } from '../models/networkCurrency.model';
import { Resolver } from './resolver';

/**
 * Generation hash resolver
 */
export class NetworkCurrencyResolver implements Resolver {
    /**
     * Resolves generationHash. If not provided by the user, this is asked to the node.
     * @param {CreateProfileOptions} options - Command options.
     * @throws {ExpectedError}
     * @returns {Promise<string>}
     */
    async resolve(options: CreateProfileOptions): Promise<NetworkCurrency> {
        try {
            const { namespaceId, divisibility } = options;
            if (namespaceId && divisibility) {
                return NetworkCurrency.createFromDTO({ namespaceId, divisibility });
            }

            const firstBlockTransactions = await new BlockHttp(options.url)
                .getBlockTransactions(UInt64.fromUint(1), new QueryParams({ pageSize: 100 }))
                .toPromise();

            return NetworkCurrency.createFromFirstBlockTransactions(firstBlockTransactions);
        } catch (ignored) {
            throw new ExpectedError(
                'The CLI cannot get the network currency description. Please, check if you can reach the Symbol url provided: ' +
                    options.url +
                    '/block/1',
            );
        }
    }
}
