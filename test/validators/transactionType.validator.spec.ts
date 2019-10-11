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
import {expect} from 'chai';
import {TransactionTypeValidator} from '../../src/validators/transactionType.validator';

describe('Transaction Type validator', () => {

    it('Valid transaction type', () => {
        const value = '414C';
        expect(new TransactionTypeValidator().validate(value, {name: 'value', source: value}))
            .to.be.equal(undefined);
    });

    it('Invalid transaction type', () => {
        const value = 'test';
        expect(() => {
            new TransactionTypeValidator().validate(value, {name: 'value', source: value});
        }).to.throws('Introduce a transaction type in hexadecimal. Example: 4154');
    });

});
