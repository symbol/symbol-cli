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
import { HashLockView } from '../../../../../src/views/transactions/details/transaction-types';
import { unsignedLockFunds1 } from '../../../../mocks/transactions/lockFunds.mock';

describe('HashLockView', () => {
    it('should return a view', () => {
        const view = HashLockView.get(unsignedLockFunds1);
        expect(view['Duration']).equal('10 blocks');
        expect(view['Mosaic (1/1)']).equal('1,234,567,890 symbol.xym (E74B99BA41F4AFEE)');
    });
});
