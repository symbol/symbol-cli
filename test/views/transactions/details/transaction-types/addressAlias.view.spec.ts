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
import { AliasAction } from 'symbol-sdk';

import { AddressAliasView } from '../../../../../src/views/transactions/details/transaction-types';
import { account1 } from '../../../../mocks/accounts.mock';
import { unsignedAddressAlias1 } from '../../../../mocks/transactions/addressAlias.mock';

describe('AddressAliasView', () => {
    it('should return a view', () => {
        const view = AddressAliasView.get(unsignedAddressAlias1);
        expect(view['action']).equal(AliasAction[unsignedAddressAlias1.aliasAction]);
        expect(view['address']).equal(account1.address.pretty());
        expect(view['namespace']).equal('symbol.xym (E74B99BA41F4AFEE)');
    });
});
