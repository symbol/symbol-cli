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
import { MosaicsView } from '../../src/views/mosaics.view';
import { mosaic1, mosaic2, mosaicId1, mosaicId2 } from '../mocks/mosaics.mock';
import { namespaceId1, namespaceId2, namespaceId3 } from '../mocks/namespaces.mock';

describe('Mosaics view', () => {
    it('get should return formatted mosaics', () => {
        expect(MosaicsView.get([mosaic1, mosaic2])).deep.equal({
            'Mosaic (1/2)': '1 D525AD41D95FCF29',
            'Mosaic (2/2)': '1,234,567,890 symbol.xym (E74B99BA41F4AFEE)',
        });
    });

    it('getMosaicLabel should return labels for mosaic Id and namespaceId', () => {
        expect(MosaicsView.getMosaicLabel(mosaicId1)).equal(mosaicId1.toHex());
        expect(MosaicsView.getMosaicLabel(mosaicId2)).equal(mosaicId2.toHex());
        expect(MosaicsView.getMosaicLabel(namespaceId1)).equal('symbol.xym (E74B99BA41F4AFEE)');
        expect(MosaicsView.getMosaicLabel(namespaceId2)).equal('alice (9CF66FB0CFEED2E0)');
        expect(MosaicsView.getMosaicLabel(namespaceId3)).equal('bob (AE7CBE4B2C3F3AB7)');
    });
});
