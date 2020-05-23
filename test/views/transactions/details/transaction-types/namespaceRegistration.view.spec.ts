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

import { NamespaceRegistrationView } from '../../../../../src/views/transactions/details/transaction-types';
import { namespaceId1 } from '../../../../mocks/namespaces.mock';
import {
    unsignedNamespaceRegistration1,
    unsignedSubNamespaceRegistration1,
} from '../../../../mocks/transactions/namespaceRegistration.mock';

describe('NamespaceRegistrationView', () => {
    it('should return a view of a root namespace registration', () => {
        const view = NamespaceRegistrationView.get(unsignedNamespaceRegistration1);
        expect(view['Namespace name']).equal('root-test-namespace');
        expect(view['Type']).equal('Root namespace');
        expect(view['Duration']).equal('1000 blocks');
        // tslint:disable-next-line:no-unused-expression
        expect(view['Parent Id']).to.be.undefined;
    });

    it('should return a view of a sub namespace registration', () => {
        const view = NamespaceRegistrationView.get(unsignedSubNamespaceRegistration1);
        expect(view['Namespace name']).equal('sub-test-namespace');
        expect(view['Type']).equal('Sub namespace');
        expect(view['Parent Id']).equal(namespaceId1.toHex());
        // tslint:disable-next-line:no-unused-expression
        expect(view['Duration']).to.be.undefined;
    });
});
