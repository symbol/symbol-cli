/*
 *
 * Copyright 2018 NEM
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
import {PrivateKeyValidator} from '../../src/validators/privateKey.validator';

describe('private key validator', () => {

    it('Invalid valid private key (uppercase) ', () => {
        const privateKey = '770DE78BF2AD0531BB7589C8839AB43F5764064785AB1E28160AEF7D3A4C2D4B';
        expect(new PrivateKeyValidator().validate(privateKey, {name: 'privateKey', source: privateKey}))
            .to.be.equal(undefined);
    });

    it('Invalid valid private key (lowercase)', () => {
        const privateKey = '770de78bf2ad0531bb7589c8839ab43f5764064785ab1e28160aef7d3a4c2d4b';
        expect(new PrivateKeyValidator().validate(privateKey, {name: 'privateKey', source: privateKey}))
            .to.be.equal(undefined);
    });

    it('Invalid private key is not valid in length', () => {
        const privateKey = '770DE78BF2AD0531BB7589C8839AB43F5764064785AB1E28160AEF7D3A4C2D4';
        expect(() => {
            new PrivateKeyValidator().validate(privateKey, {name: 'privateKey', source: privateKey});
        }).to.throws('private key should be a 64 characters hexadecimal string');
    });

});
