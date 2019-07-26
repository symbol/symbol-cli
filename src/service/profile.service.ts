/*
 *
 * Copyright 2019 NEM
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
import {Account} from 'nem2-sdk';
import {Profile} from '../model/profile';
import {ProfileRepository} from '../respository/profile.repository';

export class ProfileService {
    private readonly profileRepository: ProfileRepository;

    constructor(profileRepository: ProfileRepository) {
        this.profileRepository = profileRepository;
    }

    createNewProfile(account: Account, url: string, name: string, networkGenerationHash: string): Profile {
        return this.profileRepository.save(account, url, name, networkGenerationHash);
    }

    findProfileNamed(name: string): Profile {
        return this.profileRepository.find(name);
    }

    findAll(): Profile[] {
        return this.profileRepository.all();
    }

}
