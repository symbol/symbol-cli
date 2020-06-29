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
import { Order } from 'symbol-openapi-typescript-node-client';

import { OptionsChoiceResolver } from '../options-resolver';
import { OrderValidator } from '../validators/order.validator';
import { Resolver } from './resolver';

/**
 * Order resolver
 */
export class OrderResolver implements Resolver {
    /**
     * Resolves an order provided by the user.
     * @param {Options} options - Command options.
     * @param {string} altText - Alternative text.
     * @param {string} altKey - Alternative key.
     * @returns {Promise<Order>}
     */
    async resolve(options: Options, altText?: string, altKey?: string): Promise<Order> {
        const choices = [
            {
                title: 'Asc',
                value: Order.Asc,
            },
            {
                title: 'Desc',
                value: Order.Desc,
            },
        ];

        const value = await OptionsChoiceResolver(
            options,
            altKey ? altKey : 'order',
            altText ? altText : 'Select a direction:',
            choices,
            'select',
            new OrderValidator(),
        );
        return value;
    }
}
