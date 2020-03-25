import {expect} from 'chai'

import {ProfileMigrations} from '../../src/migrations/profile.migrations'
import {profileDTOv1, profileDTOv2} from '../mocks/profiles/profileDTO.mock'


describe('ProfileMigration', () => {
 it('version2_networkCurrency should migrate a v1 profile to v2', () => {
   // @ts-ignore: ignore warning since profileDTOv1 is missing version and network currency props
   const migrated = ProfileMigrations.version2_networkCurrency(profileDTOv1)
   expect(migrated).deep.equal(profileDTOv2)
 })
})
