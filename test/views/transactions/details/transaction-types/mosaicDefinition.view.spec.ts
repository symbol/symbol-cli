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

import { MosaicDefinitionView } from '../../../../../src/views/transactions/details/transaction-types';
import { mosaicId1 } from '../../../../mocks/mosaics.mock';
import { unsignedMosaicDefinition1 } from '../../../../mocks/transactions/mosaicDefinition.mock';

describe('MosaicDefinitionView', () => {
    it('should return a view', () => {
        const view = MosaicDefinitionView.get(unsignedMosaicDefinition1);
        expect(view['Mosaic Id']).equal(mosaicId1.toHex());
        expect(view['Duration']).equal('1,000 blocks');
        expect(view['Divisibility']).equal('3');
        // tslint:disable-next-line:no-unused-expression
        expect(view['Supply mutable']).equal('true');
        // tslint:disable-next-line:no-unused-expression
        expect(view['Transferable']).equal('true');
        // tslint:disable-next-line:no-unused-expression
        expect(view['Restrictable']).equal('true');
    });
});
