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
import {expect} from 'chai'
import {NamespaceId, NamespaceRegistrationType} from 'symbol-sdk'
import {NamespaceIdResolver, NamespaceNameResolver, NamespaceTypeResolver} from '../../src/resolvers/namespace.resolver'

describe('Namespace name resolver', () => {

    it('should return namespace id', async () => {
        const namespaceName = 'test'
        const profileOptions = {namespaceName} as any
        expect((await new NamespaceNameResolver().resolve(profileOptions)).toHex())
            .to.be.equal(new NamespaceId(namespaceName).toHex())
    })

    it('should return namespaceId with alt key', async () => {
        const name = 'test'
        const profileOptions = {name} as any
        expect((await new NamespaceNameResolver()
            .resolve(profileOptions, undefined, '', 'name')).toHex())
            .to.be.equal(new NamespaceId(name).toHex())
    })

    it('should return namespace full name', async () => {
        const namespaceName = 'test'
        const profileOptions = {namespaceName} as any
        expect((await new NamespaceNameResolver().resolve(profileOptions)).fullName)
            .to.be.equal('test')
    })

})

describe('Namespace id resolver', () => {

    it('should return namespaceId', async () => {
        const namespaceId = '85BBEA6CC462B244'
        const profileOptions = {namespaceId} as any
        expect((await new NamespaceIdResolver().resolve(profileOptions)).toHex())
            .to.be.equal(namespaceId)
    })

})

describe('Root namespace resolver', () => {

    it('should return RootNamespace', async () => {
        const profileOptions = {
            name: 'bar',
            parentName: 'foo',
            rootnamespace: true,
            subnamespace: false,
            duration: '1000',
            maxFee: '1',
            profile: 'test',
            password: 'test',
            sync: false,
            announce: false}
        expect(await new NamespaceTypeResolver()
            .resolve(profileOptions)).to.be.equal(NamespaceRegistrationType.RootNamespace)
    })

    it('should return SubNamespace', async () => {
        const profileOptions = {
            name: 'bar',
            parentName: 'foo',
            rootnamespace: false,
            subnamespace: true,
            duration: '1000',
            maxFee: '1',
            profile: 'test',
            password: 'test',
            sync: false,
            announce: false}
        expect(await new NamespaceTypeResolver()
            .resolve(profileOptions)).to.be.equal(NamespaceRegistrationType.SubNamespace)
    })

})
