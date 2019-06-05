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
import {Account, NetworkType} from 'nem2-sdk';
import {instance, mock, when} from 'ts-mockito';
import {Profile} from '../../src/model/profile';
import {ProfileRepository} from '../../src/respository/profile.repository';
import {ProfileService} from '../../src/service/profile.service';

describe('Configure service', () => {

    it('should create configure service instance via constructor', () => {
        const mockProfileRepository = mock(ProfileRepository);
        const profileService = new ProfileService(instance(mockProfileRepository));
        expect(profileService).to.not.be.equal(undefined);
    });

    it('should create a new profile', () => {
        const account = Account.createFromPrivateKey('CEDF9CB6F5D4EF67CA2F2FD4CA993F80E4FC615DFD230E15842B0A6475730B30',
            NetworkType.MIJIN_TEST);
        const url = 'http://localhost:1234';
        const networkGenerationHash = 'test';
        const profile = new Profile(account, NetworkType.MIJIN_TEST, url, 'default', networkGenerationHash);

        const mockProfileRepository = mock(ProfileRepository);
        when(mockProfileRepository.save(account, url, 'default', networkGenerationHash))
            .thenReturn(profile);

        const profileService = new ProfileService(instance(mockProfileRepository));
        const createdProfile = profileService.createNewProfile(account, url, 'default', networkGenerationHash);
        expect(createdProfile.account).to.be.equal(account);
        expect(createdProfile.url).to.be.equal(url);
        expect(createdProfile.name).to.be.equal('default');
        expect(createdProfile.networkType).to.be.equal(NetworkType.MIJIN_TEST);
        expect(createdProfile.networkGenerationHash).to.be.equal('test');
    });

    it('should find account account with name', () => {
        const account = Account.createFromPrivateKey('CEDF9CB6F5D4EF67CA2F2FD4CA993F80E4FC615DFD230E15842B0A6475730B30',
            NetworkType.MIJIN_TEST);
        const url = 'http://localhost:1234';

        const networkGenerationHash = 'test';
        const profile = new Profile(account, NetworkType.MIJIN_TEST, url, 'default', networkGenerationHash);
        const mockProfileRepository = mock(ProfileRepository);
        when(mockProfileRepository.find('default'))
            .thenReturn(profile);

        const profileService = new ProfileService(instance(mockProfileRepository));
        const createdProfile = profileService.findProfileNamed('default');
        if (createdProfile instanceof Profile) {
            expect(createdProfile.account).to.be.equal(account);
            expect(createdProfile.url).to.be.equal(url);
            expect(createdProfile.name).to.be.equal('default');
            expect(createdProfile.networkType).to.be.equal(NetworkType.MIJIN_TEST);
            expect(createdProfile.networkGenerationHash).to.be.equal(networkGenerationHash);
        }
    });

    it('should return undefined when no account found for name', () => {
        const mockProfileRepository = mock(ProfileRepository);
        when(mockProfileRepository.find('default'))
            .thenThrow(new Error('profile default not found'));

        const profileService = new ProfileService(instance(mockProfileRepository));
        expect(() => {
            profileService.findProfileNamed('default');
        }).to.throw(Error);
    });
});
