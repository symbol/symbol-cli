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
import {Profile} from '../../src/models/profile.model'
import {ProfileRepository} from '../../src/respositories/profile.repository'
import {ProfileService} from '../../src/services/profile.service'
import {expect} from 'chai'
import {NetworkType, Password, SimpleWallet} from 'symbol-sdk'
import {instance, mock, when} from 'ts-mockito'
import {NetworkCurrency} from '../../src/models/networkCurrency.model'

describe('Configure service', () => {

    it('should create profile service', () => {
        const mockProfileRepository = mock(ProfileRepository)
        expect(new ProfileService(instance(mockProfileRepository))).to.not.be.equal(undefined)
    })

    it('should create configure service instance via constructor', () => {
        const mockProfileRepository = mock(ProfileRepository)
        const profileService = new ProfileService(instance(mockProfileRepository))
        expect(profileService).to.not.be.equal(undefined)
    })

    it('should create a new profile', () => {
        const simpleWallet = SimpleWallet
            .create('default', new Password('password'), NetworkType.MIJIN_TEST)

        const url = 'http://localhost:1234'
        const networkGenerationHash = 'test'
        const networkCurrency = NetworkCurrency.createFromDTO({namespaceId: 'symbol.xym', divisibility: 6})

        const profile = new Profile(simpleWallet, url, networkGenerationHash, networkCurrency, 2)

        const mockProfileRepository = mock(ProfileRepository)
        when(mockProfileRepository.save(simpleWallet, url,  networkGenerationHash, networkCurrency))
            .thenReturn(profile)

        const profileService = new ProfileService(instance(mockProfileRepository))
        const createdProfile = profileService.createNewProfile(simpleWallet, url, networkGenerationHash, networkCurrency)
        expect(createdProfile.simpleWallet).to.be.equal(simpleWallet)
        expect(createdProfile.url).to.be.equal(url)
        expect(createdProfile.name).to.be.equal('default')
        expect(createdProfile.networkType).to.be.equal(NetworkType.MIJIN_TEST)
        expect(createdProfile.networkGenerationHash).to.be.equal('test')
    })

    it('should find account account with name', () => {
        const simpleWallet = SimpleWallet
            .create('default', new Password('password'), NetworkType.MIJIN_TEST)

        const url = 'http://localhost:1234'

        const networkGenerationHash = 'test'

        const networkCurrency = NetworkCurrency.createFromDTO({namespaceId: 'symbol.xym', divisibility: 6})

        const profile = new Profile(simpleWallet, url, networkGenerationHash, networkCurrency, 2)
        const mockProfileRepository = mock(ProfileRepository)
        when(mockProfileRepository.find('default'))
            .thenReturn(profile)

        const profileService = new ProfileService(instance(mockProfileRepository))
        const createdProfile = profileService.findProfileNamed('default')
        if (createdProfile instanceof Profile) {
            expect(createdProfile.simpleWallet).to.be.equal(simpleWallet)
            expect(createdProfile.url).to.be.equal(url)
            expect(createdProfile.name).to.be.equal('default')
            expect(createdProfile.networkType).to.be.equal(NetworkType.MIJIN_TEST)
            expect(createdProfile.networkGenerationHash).to.be.equal(networkGenerationHash)
        }
    })

    it('should return undefined when no account found for name', () => {
        const mockProfileRepository = mock(ProfileRepository)
        when(mockProfileRepository.find('default'))
            .thenThrow(new Error('profile default not found'))

        const profileService = new ProfileService(instance(mockProfileRepository))
        expect(() => {
            profileService.findProfileNamed('default')
        }).to.throw(Error)
    })

    it('should get current profile', () => {
        const simpleWallet = SimpleWallet
            .create('test', new Password('password'), NetworkType.MIJIN_TEST)
        const url = 'http://localhost:1234'
        const networkGenerationHash = 'test'
        const networkCurrency = NetworkCurrency.createFromDTO({namespaceId: 'symbol.xym', divisibility: 6})
        const profile = new Profile(simpleWallet, url, networkGenerationHash, networkCurrency, 2,)
        const mockProfileRepository = mock(ProfileRepository)
        when(mockProfileRepository.find('test'))
            .thenReturn(profile)

        const profileService = new ProfileService(instance(mockProfileRepository))
        const currentProfile = profileService.getDefaultProfile()
        if (currentProfile instanceof Profile) {
            expect(currentProfile.simpleWallet).to.be.equal(simpleWallet)
        }
    })
})
