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
import {NetworkType, Password, SimpleWallet} from 'nem2-sdk';
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
        const simpleWallet = SimpleWallet
            .create('test', new Password('default'), NetworkType.MIJIN_TEST);

        const url = 'http://localhost:3000';
        const networkGenerationHash = 'test';
        const profileRepository = new ProfileRepository(repositoryFileUrl);
        const savedProfile = profileRepository.save(simpleWallet, url, networkGenerationHash);
        expect(savedProfile.simpleWallet).to.be.equal(simpleWallet);
    });

    it('should save new account and find it', () => {
        const simpleWallet = SimpleWallet
            .create('test', new Password('default'), NetworkType.MIJIN_TEST);

        const url = 'http://localhost:3000';
        const profileRepository = new ProfileRepository(repositoryFileUrl);
        const networkGenerationHash = 'test';
        profileRepository.save(simpleWallet, url, networkGenerationHash);
        const savedProfile = profileRepository.find('default');
        expect(savedProfile).to.not.be.equal(undefined);

        if (savedProfile instanceof Profile) {
            expect(savedProfile.simpleWallet.address.plain())
                .to.be.equal(simpleWallet.address.plain());

            expect(savedProfile.simpleWallet.address.networkType)
                .to.be.equal(simpleWallet.address.networkType);

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
        const simpleWallet = SimpleWallet
            .create('default', new Password('password'), NetworkType.MIJIN_TEST);

        const url = 'http://localhost:3000';

        const simpleWallet2 = SimpleWallet
            .create('default', new Password('password'), NetworkType.MIJIN_TEST);

        const url2 = 'http://localhost:3000';
        const profileRepository = new ProfileRepository(repositoryFileUrl);
        const networkGenerationHash = 'test';
        profileRepository.save(simpleWallet, url, networkGenerationHash);
        profileRepository.save(simpleWallet2, url2, networkGenerationHash);
        const savedProfile = profileRepository.find('default');
        expect(savedProfile).to.not.be.equal(undefined);

        if (savedProfile instanceof Profile) {
            expect(savedProfile.simpleWallet.address.plain())
                .to.be.equal(simpleWallet2.address.plain());

            expect(savedProfile.simpleWallet.address.networkType)
                .to.be.equal(simpleWallet2.address.networkType);

            expect(savedProfile.url).to.be.equal(url2);
            expect(savedProfile.name).to.be.equal('default');
            expect(savedProfile.networkType).to.be.equal(NetworkType.MIJIN_TEST);
            expect(savedProfile.networkGenerationHash).to.be.equal('test');
        }
    });

    it('should save two accounts and find default', () => {
        const simpleWallet1 = SimpleWallet
            .create('default', new Password('password'), NetworkType.MIJIN_TEST);

        const url = 'http://localhost:3000';

        const simpleWallet2 = SimpleWallet
            .create('simpleWallet2', new Password('password'), NetworkType.MIJIN_TEST);

        const url2 = 'http://localhost:3000';

        const profileRepository = new ProfileRepository(repositoryFileUrl);
        const networkGenerationHash = 'test';
        profileRepository.save(simpleWallet1, url, networkGenerationHash);
        profileRepository.save(simpleWallet2, url2, networkGenerationHash);
        profileRepository.setDefaultProfile('default');
        const currentDefaultProfile = profileRepository.getDefaultProfile();
        expect(currentDefaultProfile).to.not.be.equal(undefined);
        if (currentDefaultProfile instanceof Profile) {
            expect(currentDefaultProfile.simpleWallet.address.plain())
                .to.be.equal(simpleWallet2.address.plain());
        }
    });
});
