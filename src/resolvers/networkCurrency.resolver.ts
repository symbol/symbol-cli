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
import { TransactionGroup, TransactionHttp, UInt64 } from 'symbol-sdk';

import { CreateProfileOptions } from '../interfaces/create.profile.options';
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

            const firstBlockTransactions = await new TransactionHttp(options.url)
                .search({ height: UInt64.fromUint(1), pageSize: 100, group: TransactionGroup.Confirmed })
                .toPromise();

            return NetworkCurrency.createFromFirstBlockTransactions(firstBlockTransactions.data);
        } catch (ignored) {
            throw new ExpectedError(
                'The CLI cannot get the network currency mosaic description. Pass the network currency mosaic options with the options `namespace-id` and `divisibility`. E.g.: --namespace-id symbol.xym --divisibility 6',
            );
        }
    }
}
