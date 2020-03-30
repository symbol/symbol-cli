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
import {HashType} from 'symbol-sdk'
import {Validator} from './validator'

/**
 * Private key validator
 */
export class ProofValidator implements Validator<string> {
    public constructor(private readonly hashType: HashType | undefined) { }

    /**
     * Validates a hash length.
     * @param {string} value - Hash.
     * @returns {true | string}
     */
    validate(value: string): boolean | string {
      // All hashes have a 64 char length exept Op_Hash_160 that can be 40
      if (!this.hashType || this.hashType === HashType.Op_Hash_160) {
        return value.length === 40 || value.length === 64
          ? true : 'A proof should be 64 or 40 chars long.'
      }

      return value.length === 64 ? true : 'A proof should be 64 chars long.'
    }
}
