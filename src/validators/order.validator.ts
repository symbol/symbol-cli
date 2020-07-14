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

import { Order } from 'symbol-sdk';

import { Validator } from './validator';

/**
 * Order validator
 */
export class OrderValidator implements Validator<string> {
    /**
     * Validates if order is valid.
     * @param {string} value - Order type.
     * @returns {true | string}
     */
    validate(value: string): boolean | string {
        const test = value in Order;
        return test ? true : 'Order must be one of (Asc, Desc)';
    }
}
