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
import * as fs from 'fs';
import {Account, NetworkType} from 'nem2-sdk';
import {Profile} from '../../src/model/profile';
import {ProfileRepository} from '../../src/respository/profile.repository';

describe('ProfileRepository', () => {

    let repositoryFileUrl: string;

    const removeAccountsFile = () => {
        if (fs.existsSync(process.env.HOME + '/' + repositoryFileUrl)) {
            fs.unlinkSync(process.env.HOME + '/' + repositoryFileUrl);
        }
    };

    before(() => {
        removeAccountsFile();
        repositoryFileUrl = '.nem2rctest.json';
    });

    after(() => {
        removeAccountsFile();
    });

    it('should create account repository via constructor', () => {
        const profileRepository = new ProfileRepository(repositoryFileUrl);
        expect(profileRepository).to.not.be.equal(undefined);
    });

    it('should save new account', () => {
        const account = Account.createFromPrivateKey('CEDF9CB6F5D4EF67CA2F2FD4CA993F80E4FC615DFD230E15842B0A6475730B30',
            NetworkType.MIJIN_TEST);
        const url = 'http://localhost:3000';
        const networkGenerationHash = 'test';
        const profileRepository = new ProfileRepository(repositoryFileUrl);
        const savedProfile = profileRepository.save(account, url, 'default', networkGenerationHash);
        expect(savedProfile.account).to.be.equal(account);
    });

    it('should save new account and find it', () => {
        const account = Account.createFromPrivateKey('CEDF9CB6F5D4EF67CA2F2FD4CA993F80E4FC615DFD230E15842B0A6475730B30',
            NetworkType.MIJIN_TEST);
        const url = 'http://localhost:3000';
        const profileRepository = new ProfileRepository(repositoryFileUrl);
        const networkGenerationHash = 'test';
        profileRepository.save(account, url, 'default', networkGenerationHash);
        const savedProfile = profileRepository.find('default');
        expect(savedProfile).to.not.be.equal(undefined);
        if (savedProfile instanceof Profile) {
            expect(savedProfile.account.privateKey).to.be.equal(account.privateKey);
            expect(savedProfile.account.address.plain()).to.be.equal(account.address.plain());
            expect(savedProfile.account.address.networkType).to.be.equal(account.address.networkType);
            expect(savedProfile.url).to.be.equal(url);
            expect(savedProfile.name).to.be.equal('default');
            expect(savedProfile.networkType).to.be.equal(NetworkType.MIJIN_TEST);
            expect(savedProfile.networkGenerationHash).to.be.equal('test');
        }
    });

    it('should not find not saved account', () => {
        const profileRepository = new ProfileRepository(repositoryFileUrl);
        expect(() => profileRepository.find('name')).to.throw(Error);
    });

    it('should save two account with name default and find last one', () => {
        const account = Account.createFromPrivateKey('CEDF9CB6F5D4EF67CA2F2FD4CA993F80E4FC615DFD230E15842B0A6475730B30',
            NetworkType.MIJIN_TEST);
        const url = 'http://localhost:3000';
        const account2 = Account.createFromPrivateKey('CEDF9CB6F5D4EF67CA2F2FD4CA993F80E4FC615DFD230E15842B0A6475730B31',
            NetworkType.MIJIN_TEST);
        const url2 = 'http://localhost:3000';
        const profileRepository = new ProfileRepository(repositoryFileUrl);
        const networkGenerationHash = 'test';
        profileRepository.save(account, url, 'default', networkGenerationHash);
        profileRepository.save(account2, url2, 'default', networkGenerationHash);
        const savedProfile = profileRepository.find('default');
        expect(savedProfile).to.not.be.equal(undefined);
        if (savedProfile instanceof Profile) {
            expect(savedProfile.account.privateKey).to.be.equal(account2.privateKey);
            expect(savedProfile.account.address.plain()).to.be.equal(account2.address.plain());
            expect(savedProfile.account.address.networkType).to.be.equal(account2.address.networkType);
            expect(savedProfile.url).to.be.equal(url2);
            expect(savedProfile.name).to.be.equal('default');
            expect(savedProfile.networkType).to.be.equal(NetworkType.MIJIN_TEST);
            expect(savedProfile.networkGenerationHash).to.be.equal('test');
        }
    });

    it('should save two accounts and find default', () => {
        const account = Account.createFromPrivateKey('CEDF9CB6F5D4EF67CA2F2FD4CA993F80E4FC615DFD230E15842B0A6475730B30',
            NetworkType.MIJIN_TEST);
        const url = 'http://localhost:3000';
        const account2 = Account.createFromPrivateKey('CEDF9CB6F5D4EF67CA2F2FD4CA993F80E4FC615DFD230E15842B0A6475730B31',
            NetworkType.MIJIN_TEST);
        const url2 = 'http://localhost:3000';
        const profileRepository = new ProfileRepository(repositoryFileUrl);
        const networkGenerationHash = 'test';
        profileRepository.save(account, url, 'nodefault', networkGenerationHash);
        profileRepository.save(account2, url2, 'default', networkGenerationHash);
        profileRepository.setDefaultProfile('default');
        const currentDefaultProfile = profileRepository.getDefaultProfile();
        expect(currentDefaultProfile).to.not.be.equal(undefined);
        if (currentDefaultProfile instanceof Profile) {
            expect(currentDefaultProfile.account.privateKey).to.be.equal(account2.privateKey);
        }
    });

});
