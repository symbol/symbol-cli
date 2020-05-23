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

import { AggregateBondedView } from '../../../../../src/views/transactions/details/transaction-types';
import { unsignedAggregateBonded1 } from '../../../../mocks/transactions/aggregateBonded.mock';

describe('AggregateBondedView', () => {
    it('should return a view', () => {
        const view = AggregateBondedView.get(unsignedAggregateBonded1);

        expect(view['title0']).deep.equal({
            content: 'Inner transaction 1 of 2 - Transfer',
            colSpan: 2,
            hAlign: 'center',
        });

        expect(view['[Inner tx. 1 of 2] Recipient']).equal('TALRJL-Z2FDOI-B7JCZJ-ANUJCM-GCJA6R-BRIYK4-NTDM');
        expect(view['[Inner tx. 1 of 2] Message']).equal('This is a mock message!');
        expect(view['[Inner tx. 1 of 2] Mosaic (1/1)']).equal('1 D525AD41D95FCF29');

        expect(view['title1']).deep.equal({
            content: 'Inner transaction 2 of 2 - Transfer',
            colSpan: 2,
            hAlign: 'center',
        });

        expect(view['[Inner tx. 2 of 2] Recipient']).equal('alice (9CF66FB0CFEED2E0)');
        expect(view['[Inner tx. 2 of 2] Message']).equal('This is a mock message!');
        expect(view['[Inner tx. 2 of 2] Mosaic (1/2)']).equal('1 D525AD41D95FCF29');
        expect(view['[Inner tx. 2 of 2] Mosaic (2/2)']).equal('1,234,567,890 symbol.xym (E74B99BA41F4AFEE)');
    });
});
