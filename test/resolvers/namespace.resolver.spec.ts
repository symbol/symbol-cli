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
import {NamespaceIdResolver, NamespaceNameResolver, NamespaceTypeResolver} from '../../src/resolvers/namespace.resolver'
import {expect} from 'chai'
import {NamespaceId, NamespaceRegistrationType} from 'symbol-sdk'

describe('Namespace name resolver', () => {

    it('should return namespace id', async () => {
        const namespaceName = 'test'
        const options = {namespaceName} as any
        expect((await new NamespaceNameResolver().resolve(options)).toHex())
            .to.be.equal(new NamespaceId(namespaceName).toHex())
    })

    it('should return namespaceId with alt key', async () => {
        const name = 'test'
        const options = {name} as any
        expect((await new NamespaceNameResolver()
            .resolve(options, '', 'name')).toHex())
            .to.be.equal(new NamespaceId(name).toHex())
    })

    it('should return namespace full name', async () => {
        const namespaceName = 'test'
        const options = {namespaceName} as any
        expect((await new NamespaceNameResolver().resolve(options)).fullName)
            .to.be.equal('test')
    })

    it('should change key', async () => {
        const key = 'test'
        const options = {key} as any
        expect((await new NamespaceNameResolver()
            .resolve(options, 'altText', 'key')).fullName)
            .to.be.equal('test')
    })


})

describe('Namespace id resolver', () => {

    it('should return namespaceId', async () => {
        const namespaceId = '85BBEA6CC462B244'
        const options = {namespaceId} as any
        expect((await new NamespaceIdResolver().resolve(options)).toHex())
            .to.be.equal(namespaceId)
    })

    it('should return namespaceId', async () => {
        const key = '85BBEA6CC462B244'
        const options = {key} as any
        expect((await new NamespaceIdResolver()
            .resolve(options, 'altText', 'key')).toHex())
            .to.be.equal(key)
    })
})

describe('Root namespace resolver', () => {

    it('should return RootNamespace', async () => {
        const options = {
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
            .resolve(options)).to.be.equal(NamespaceRegistrationType.RootNamespace)
    })

    it('should return SubNamespace', async () => {
        const options = {
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
            .resolve(options, 'altText'))
            .to.be.equal(NamespaceRegistrationType.SubNamespace)
    })

})
