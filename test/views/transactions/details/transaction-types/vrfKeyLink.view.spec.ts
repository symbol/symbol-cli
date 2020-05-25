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
import { LinkAction } from 'symbol-sdk';

import { VrfKeyLinkView } from '../../../../../src/views/transactions/details/transaction-types';
import { unsignedVrfKeyLink1 } from '../../../../mocks/transactions/vrfKeyLink.mock';

describe('VrfLinkView', () => {
    it('should return a view', () => {
        const view = VrfKeyLinkView.get(unsignedVrfKeyLink1);
        expect(view['Action']).equal(LinkAction[LinkAction.Link]);
        expect(view['Linked key']).equal('0'.repeat(64));
    });
});
