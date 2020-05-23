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

import { expect } from 'chai';
import { Order } from 'symbol-sdk';

import { AccountTransactionsOptions } from '../../src/interfaces/account.transactions.command';

describe('Announce Transactions Command', () => {
    it('should get query params', () => {
        const options = new AccountTransactionsOptions();
        expect(options.getQueryParams().pageSize).to.be.equal(10);
        expect(options.getQueryParams().order).to.be.equal(Order.DESC);
        expect(options.getQueryParams().id).to.be.equal(undefined);
    });

    it('should get query params with pageSize', () => {
        const options = new AccountTransactionsOptions();
        options.pageSize = 100;
        expect(options.getQueryParams().pageSize).to.be.equal(100);
    });

    it('should get query params with id', () => {
        const options = new AccountTransactionsOptions();
        options.id = '1';
        expect(options.getQueryParams().id).to.be.equal('1');
    });

    it('should get query params with order', () => {
        const options = new AccountTransactionsOptions();
        options.order = 'ASC';
        expect(options.getQueryParams().order).to.be.equal(Order.ASC);
    });
});
