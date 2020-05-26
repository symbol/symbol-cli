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
import { Convert } from 'symbol-sdk';

import { MosaicMetadataView } from '../../../../../src/views/transactions/details/transaction-types';
import { account1 } from '../../../../mocks/accounts.mock';
import { mosaicId1 } from '../../../../mocks/mosaics.mock';
import { unsignedMosaicMetadata1 } from '../../../../mocks/transactions/mosaicMetadata.mock';

describe('MosaicMetadataView', () => {
    it('should return a view', () => {
        const view = MosaicMetadataView.get(unsignedMosaicMetadata1);
        expect(view['Target public key']).equal(account1.publicKey);
        expect(view['Scoped metadata key']).equal('00000000000003E8');
        expect(view['Target mosaic Id']).equal(mosaicId1.toHex());
        expect(view['Value size delta']).equal('1');
        expect(view['Value']).equal(Convert.uint8ToUtf8(new Uint8Array(10)));
    });
});
