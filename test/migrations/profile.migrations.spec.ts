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

import {ProfileMigrations} from '../../src/migrations/profile.migrations'
import {profileDTOv1, profileDTOv2, profileDTO2v2, profileDTO2v3} from '../mocks/profiles/profileDTO.mock'


describe('ProfileMigration', () => {
  it('version2_networkCurrency should migrate a v1 profile to v2', () => {
    // @ts-ignore: ignore warning since profileDTOv1 is missing version and network currency props
    const migrated = ProfileMigrations.version2_networkCurrency(profileDTOv1)
    expect(migrated).deep.equal(profileDTOv2)
  })

  it('version3_profileType should migrate a v2 profile to v3', () => {
    // @ts-ignore: ignore warning since profileDTOv1 is missing version and network currency props
    const migrated = ProfileMigrations.version3_profileType(profileDTO2v2)
    expect(migrated).deep.equal(profileDTO2v3)
  })
})
