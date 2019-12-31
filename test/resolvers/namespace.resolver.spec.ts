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
import {expect} from 'chai';
import {NamespaceId} from 'nem2-sdk';
import {NamespaceIdResolver, NamespaceNameResolver} from '../../src/resolvers/namespace.resolver';

describe('Namespace name resolver', () => {

    it('should return namespace id', () => {
        const namespaceName = 'test';
        const profileOptions = {namespaceName} as any;
        expect(new NamespaceNameResolver().resolve(profileOptions).toHex())
            .to.be.equal(new NamespaceId(namespaceName).toHex());
    });

    it('should throw error if invalid namespace name', () => {
        const namespaceName = 'Test';
        const profileOptions = {namespaceName} as any;
        expect(() => new NamespaceNameResolver().resolve(profileOptions))
            .to.throws(Error);
    });

});

describe('Namespace id resolver', () => {

    it('should return namespaceId', () => {
        const namespaceId = '85BBEA6CC462B244';
        const profileOptions = {namespaceId} as any;
        expect(new NamespaceIdResolver().resolve(profileOptions).toHex())
            .to.be.equal(namespaceId);
    });

    it('should throw error if invalid namespaceId', () => {
        const namespaceId = '85BBEA6';
        const profileOptions = {namespaceId} as any;
        expect(() => new NamespaceIdResolver().resolve(profileOptions))
            .to.throws(Error);
    });

});
