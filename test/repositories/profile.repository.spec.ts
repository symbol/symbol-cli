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
import * as fs from 'fs'
import {expect} from 'chai'

import {NetworkCurrency} from '../../src/models/networkCurrency.model'
import {NetworkType, Password, SimpleWallet} from 'symbol-sdk'
import {Profile} from '../../src/models/profile.model'
import {ProfileRepository} from '../../src/respositories/profile.repository'
import {profileDTOv1, profileDTO2v2} from '../mocks/profiles/profileDTO.mock'
import {when, spy} from 'ts-mockito'

const networkCurrency = NetworkCurrency.createFromDTO({namespaceId: 'symbol.xym', divisibility: 6})

describe('ProfileRepository', () => {

    let repositoryFileUrl: string

    const removeAccountsFile = () => {
        const file = (process.env.HOME  || process.env.USERPROFILE) + '/' + repositoryFileUrl
        if (fs.existsSync(file)) {
            fs.unlinkSync(file)
        }
    }

    before(() => {
        removeAccountsFile()
        repositoryFileUrl = '.symbolrctest.json'
    })

    beforeEach(() => {
        removeAccountsFile()
    })

    after(() => {
        removeAccountsFile()
    })

    it('should create account repository via constructor', () => {
        const profileRepository = new ProfileRepository(repositoryFileUrl)
        expect(profileRepository).to.not.be.equal(undefined)
        expect(profileRepository['fileUrl']).to.be.equal(repositoryFileUrl)
    })

    it('should save new account', () => {
        const simpleWallet = SimpleWallet
            .create('test', new Password('password'), NetworkType.MIJIN_TEST)
        const url = 'http://localhost:3000'
        const networkGenerationHash = 'test'
        const profileRepository = new ProfileRepository(repositoryFileUrl)
        const savedProfile = profileRepository.save(simpleWallet, url, networkGenerationHash, networkCurrency)
        expect(savedProfile.simpleWallet).to.be.equal(simpleWallet)
    })

    it('should not save two accounts with the same name', () => {
        const simpleWallet = SimpleWallet
            .create('default', new Password('password'), NetworkType.MIJIN_TEST)
        const simpleWallet2 = SimpleWallet
            .create('default', new Password('password'), NetworkType.MIJIN_TEST)
        const url = 'http://localhost:3000'
        const profileRepository = new ProfileRepository(repositoryFileUrl)
        const networkGenerationHash = 'test'
        profileRepository.save(simpleWallet, url, networkGenerationHash, networkCurrency)
        expect(() => profileRepository.save(simpleWallet2, url, networkGenerationHash, networkCurrency))
            .to.throws('A profile named default already exists.')
    })

    it('should find an account', () => {
        const simpleWallet = SimpleWallet
            .create('default', new Password('password'), NetworkType.MIJIN_TEST)
        const url = 'http://localhost:3000'
        const profileRepository = new ProfileRepository(repositoryFileUrl)
        const networkGenerationHash = 'test'
        profileRepository.save(simpleWallet, url, networkGenerationHash, networkCurrency)
        const savedProfile = profileRepository.find('default')
        expect(savedProfile).to.not.be.equal(undefined)

        if (savedProfile instanceof Profile) {
            expect(savedProfile.simpleWallet.address.plain())
                .to.be.equal(simpleWallet.address.plain())

            expect(savedProfile.simpleWallet.address.networkType)
                .to.be.equal(simpleWallet.address.networkType)

            expect(savedProfile.url).to.be.equal(url)
            expect(savedProfile.name).to.be.equal('default')
            expect(savedProfile.networkType).to.be.equal(NetworkType.MIJIN_TEST)
            expect(savedProfile.networkGenerationHash).to.be.equal('test')
        }
    })

    it('should not find not saved account', () => {
        const profileRepository = new ProfileRepository(repositoryFileUrl)
        expect(() => profileRepository.find('name')).to.throw(Error)
    })

    it('should get all profiles',  () => {
        const simpleWallet1 = SimpleWallet
            .create('simpleWallet1', new Password('password'), NetworkType.MIJIN_TEST)
        const simpleWallet2 = SimpleWallet
            .create('default', new Password('password'), NetworkType.MIJIN_TEST)
        const profileRepository = new ProfileRepository(repositoryFileUrl)
        const networkGenerationHash = 'test'
        const url = 'http://localhost:3000'
        profileRepository.save(simpleWallet1, url, networkGenerationHash, networkCurrency)
        profileRepository.save(simpleWallet2, url, networkGenerationHash, networkCurrency)
        const all = profileRepository.all()
        expect(all.length).to.be.equal(2)
    })

    it('should get all profiles and update their schemas if necessary',  () => {
        const profileRepository = new ProfileRepository(repositoryFileUrl)
        // @ts-ignore // accessing a private property
        profileRepository.saveProfiles({...profileDTOv1, ...profileDTO2v2})
        const all = profileRepository.all()
        expect(all[0].version).to.not.be.undefined
        expect(all[0].networkCurrency).deep.equal(networkCurrency)
    })

    it('should set and get default profile',  () => {
        const simpleWallet1 = SimpleWallet
            .create('simpleWallet1', new Password('password'), NetworkType.MIJIN_TEST)
        const simpleWallet2 = SimpleWallet
            .create('default', new Password('password'), NetworkType.MIJIN_TEST)
        const profileRepository = new ProfileRepository(repositoryFileUrl)
        const networkGenerationHash = 'test'
        const url = 'http://localhost:3000'
        profileRepository.save(simpleWallet1, url, networkGenerationHash, networkCurrency)
        profileRepository.save(simpleWallet2, url, networkGenerationHash, networkCurrency)
        profileRepository.setDefault('default')
        const currentDefaultProfile = profileRepository.getDefaultProfile()
        expect(currentDefaultProfile).to.not.be.equal(undefined)
        if (currentDefaultProfile instanceof Profile) {
            expect(currentDefaultProfile.simpleWallet.address.plain())
                .to.be.equal(simpleWallet2.address.plain())
        }
    })

    it('should throw error if default does not exist',  () => {
        const profileRepository = new ProfileRepository(repositoryFileUrl)
        expect(() => profileRepository.getDefaultProfile()).to.throws(Error)
    })

    it('should throw error if unable to create a new file',  () => {
        const profileRepository = new ProfileRepository(repositoryFileUrl)
        const mockedFs: any = spy(fs)
        when(mockedFs.writeFileSync(profileRepository.filePath, '{}', 'utf-8'))
            .thenThrow(new Error())
        expect(() => profileRepository.all()).to.throws(Error)
    })

    it('should throw error if unable to save migrated files',  () => {
        const profileRepository = new ProfileRepository(repositoryFileUrl)
        // @ts-ignore // accessing a private property
        profileRepository.saveProfiles({...profileDTOv1, ...profileDTO2v2})
        const mockedFs: any = spy(fs)
        when(mockedFs.writeFileSync).thenThrow(new Error())
        expect(() => profileRepository.all()).to.throws(Error)
    })
})
