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
import { Account, NetworkType, Password, SimpleWallet } from 'symbol-sdk';
import { instance, mock, when } from 'ts-mockito';
import { HdProfile } from '../../src/models/hdProfile.model';
import { NetworkCurrency } from '../../src/models/networkCurrency.model';
import { PrivateKeyProfile } from '../../src/models/privateKeyProfile.model';
import { epochAdjustment, Profile } from '../../src/models/profile.model';
import { ProfileRepository } from '../../src/respositories/profile.repository';
import { ProfileService } from '../../src/services/profile.service';
import { mockPrivateKeyProfile1 } from '../mocks/profiles/profile.mock';

const networkCurrency = NetworkCurrency.createFromDTO({ namespaceId: 'symbol.xym', divisibility: 6 });
describe('Configure service', () => {
    it('should create profile service', () => {
        const mockProfileRepository = mock(ProfileRepository);
        expect(new ProfileService(instance(mockProfileRepository))).to.not.be.equal(undefined);
    });

    it('should create configure service instance via constructor', () => {
        const mockProfileRepository = mock(ProfileRepository);
        const profileService = new ProfileService(instance(mockProfileRepository));
        expect(profileService).to.not.be.equal(undefined);
    });

    it('should find account account with name', () => {
        const profile = mockPrivateKeyProfile1;
        const mockProfileRepository = mock(ProfileRepository);

        when(mockProfileRepository.find('default')).thenReturn(profile);

        const profileService = new ProfileService(instance(mockProfileRepository));
        const createdProfile = profileService.findProfileNamed('default');

        if (createdProfile instanceof Profile) {
            expect(createdProfile.simpleWallet).to.be.equal(profile.simpleWallet);
            expect(createdProfile.url).to.be.equal(profile.url);
            expect(createdProfile.name).to.be.equal('default');
            expect(createdProfile.networkType).to.be.equal(NetworkType.TEST_NET);
            expect(createdProfile.networkGenerationHash).to.be.equal(profile.networkGenerationHash);
        }
    });

    it('should return undefined when no account found for name', () => {
        const mockProfileRepository = mock(ProfileRepository);
        when(mockProfileRepository.find('default')).thenThrow(new Error('profile default not found'));

        const profileService = new ProfileService(instance(mockProfileRepository));
        expect(() => {
            profileService.findProfileNamed('default');
        }).to.throw(Error);
    });

    it('should get current profile', () => {
        const simpleWallet = SimpleWallet.create('test', new Password('password'), NetworkType.TEST_NET);
        const profile = mockPrivateKeyProfile1;
        const mockProfileRepository = mock(ProfileRepository);
        when(mockProfileRepository.find('test')).thenReturn(profile);

        const profileService = new ProfileService(instance(mockProfileRepository));
        const currentProfile = profileService.getDefaultProfile();
        if (currentProfile instanceof Profile) {
            expect(currentProfile.simpleWallet).to.be.equal(simpleWallet);
        }
    });

    it('should create a private key profile', () => {
        const mockProfileRepository = mock(ProfileRepository);
        const profile = new ProfileService(mockProfileRepository).createNewProfile({
            generationHash: 'default',
            epochAdjustment: epochAdjustment,
            isDefault: false,
            name: 'default',
            networkCurrency,
            networkType: NetworkType.MAIN_NET,
            password: new Password('password'),
            url: 'http://localhost:3000',
            privateKey: Account.generateNewAccount(NetworkType.MAIN_NET).privateKey,
        });

        expect(profile).to.be.instanceOf(PrivateKeyProfile);
    });

    it('should create an HD profile', () => {
        const mockProfileRepository = mock(ProfileRepository);
        const profile = new ProfileService(instance(mockProfileRepository)).createNewProfile({
            generationHash: 'default',
            epochAdjustment: epochAdjustment,
            isDefault: false,
            name: 'default',
            networkCurrency,
            networkType: NetworkType.MAIN_NET,
            password: new Password('password'),
            url: 'http://localhost:3000',
            // eslint-disable-next-line max-len
            mnemonic:
                'uniform promote eyebrow frequent mother order evolve spell elite lady clarify accuse annual tenant rotate walnut wisdom render before million scrub scan crush sense',
            pathNumber: 0,
        });

        expect(profile).to.be.instanceOf(HdProfile);
    });
});
