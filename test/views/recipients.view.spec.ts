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

import { RecipientsView } from '../../src/views/recipients.view';
import { account1 } from '../mocks/accounts.mock';
import { namespaceId1, namespaceId2 } from '../mocks/namespaces.mock';

describe('Mosaics view', () => {
    it('getMosaicLabel should return labels for mosaic Id and namespaceId', () => {
        expect(RecipientsView.get(namespaceId1)).equal('symbol.xym (E74B99BA41F4AFEE)');
        expect(RecipientsView.get(namespaceId2)).equal('alice (9CF66FB0CFEED2E0)');
        expect(RecipientsView.get(account1.address)).equal(account1.address.pretty());
    });
});
