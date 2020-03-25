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
import {ProfileRecord} from '../models/profile.model'

export class ProfileMigrations {
 /**
  * Get all migrations
  * **NOTE: CURRENT_PROFILE_VERSION variable should be updated** in Profile model
  * when adding a new migration
  * @static
  * @returns {Record<string, (profiles: ProfileRecord) => ProfileRecord>}
  */
 public static get(): Record<string, (profiles: ProfileRecord) => ProfileRecord> {
   return {
     2: ProfileMigrations.version2_networkCurrency,
   }
 }

 /**
  * Adds a version property
  * Adds a networkCurrency property
  * @static
  * @param {ProfileRecord} profiles
  * @returns {ProfileRecord}
  */
 public static version2_networkCurrency(profiles: ProfileRecord): ProfileRecord {
  return Object
   .entries(profiles)
   .map(([name, profile]) => ({
    [name]: {
     ...profile,
     version: 2,
     networkCurrency: {
      namespaceId: 'symbol.xym',
      divisibility: 6,
     },
    },
   }))
   .reduce((acc, profile) => ({...acc, ...profile}), {}) as ProfileRecord
 }
}
