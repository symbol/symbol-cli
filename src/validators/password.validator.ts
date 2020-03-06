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
import {Validator} from './validator'
import {Password} from 'symbol-sdk'

/**
 * Password validator
 */
export class PasswordValidator implements Validator<string> {

     /**
      * Validates if a password has at least 8 chars.
      * @param {string} value - Password.
      * @returns {true | string}
      */
     validate(value: string): boolean | string {
        try {
             const ignored = new Password(value)
         } catch (error) {
              return 'Password should have a minimum of 8 characters'
         }
         return true
     }
}
