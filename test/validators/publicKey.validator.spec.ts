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
import { PublicKeysValidator, PublicKeyValidator } from '../../src/validators/publicKey.validator';

describe('public key validator', () => {

    it('Valid public key (uppercase)', () => {
        const publicKey = '58A86B00DEED2CAC9AB62B96BA02B37E079772738DD3B3C6DF400DE796D7C347';
        expect(new PublicKeyValidator().validate(publicKey, { name: 'publicKey', source: publicKey }))
            .to.be.equal(undefined);
    });

    it('Valid public key (lowercase)', () => {
        const publicKey = '58a86b00deed2cac9ab62b96ba02b37e079772738dd3b3c6df400de796d7c347';
        expect(new PublicKeyValidator().validate(publicKey, { name: 'publicKey', source: publicKey }))
            .to.be.equal(undefined);
    });

    it('Invalid public key (length)', () => {
        const publicKey = '58A86B00DEED2CAC9AB62B96BA02B37E079772738DD3B3C6DF400DE796D7C34';
        expect(() => {
            new PublicKeyValidator().validate(publicKey, { name: 'publicKey', source: publicKey });
        }).to.throws('public key should be a 64 characters hexadecimal string');
    });

});

describe('public key group validator', () => {
    it('Valid public key group (uppercase)', () => {
        const publicKeys = '58A86B00DEED2CAC9AB62B96BA02B37E079772738DD3B3C6DF400DE796D7C347,' +
            '58A86B00DEED2CAC9AB62B96BA02B37E079772738DD3B3C6DF400DE796D7C347,' +
            '58A86B00DEED2CAC9AB62B96BA02B37E079772738DD3B3C6DF400DE796D7C347';
        expect(new PublicKeysValidator().validate(publicKeys, { name: 'publicKeys', source: publicKeys }))
            .to.be.equal(undefined);
    });

    it('Valid public key group (lowercase)', () => {
        const publicKeys = '58a86b00deed2cac9ab62b96ba02b37e079772738dd3b3c6df400de796d7c347,' +
            '58a86b00deed2cac9ab62b96ba02b37e079772738dd3b3c6df400de796d7c347,' +
            '58a86b00deed2cac9ab62b96ba02b37e079772738dd3b3c6df400de796d7c347';
        expect(new PublicKeysValidator().validate(publicKeys, { name: 'publicKeys', source: publicKeys }))
            .to.be.equal(undefined);
    });

    it('Invalid public key group (length)', () => {
        const publicKeys = '58A86B00DEED2CAC9AB62B96BA02B37E079772738DD3B3C6DF400DE796D7C34,' +
            '58A86B00DEED2CAC9AB62B96BA02B37E079772738DD3B3C6DF400DE796D7C34,' +
            '58A86B00DEED2CAC9AB62B96BA02B37E079772738DD3B3C6DF400DE796D7C34';
        expect(() => {
            new PublicKeysValidator().validate(publicKeys, { name: 'publicKeys', source: publicKeys });
        }).to.throws('public key should be a 64 characters hexadecimal string');
    });
});
