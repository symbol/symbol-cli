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
import {MosaicId, NamespaceId} from 'symbol-sdk'

/**
 * Mosaic id validator
 */
export class MosaicIdValidator implements Validator<string> {

    /**
     * Validates if a mosaic id object can be created from a string.
     * @param {string} value - MosaicId in hexadecimal.
     * @returns {true | string}
     */
    validate(value: string): boolean | string {
        try {
            const ignored = new MosaicId(value)
        } catch (err) {
            return 'Enter a mosaic id in hexadecimal format. Example: 941299B2B7E1291C'
        }
        return true
    }
}

/**
 * Mosaic id alias validator
 */
export class MosaicIdAliasValidator implements Validator<string> {

    /**
     * Validates if a mosaic id object can be created from a string.
     * @param {string} value - MosaicId in hexadecimal or Namespace name. If starts with '@', it is a namespace name.
     * @returns {true | string}
     */
    validate(value: string): boolean | string {
        const aliasTag = '@'
        if (value.charAt(0) !== aliasTag) {
            try {
                const ignored = new MosaicId(value)
            } catch (err) {
                return 'Enter a mosaic id in hexadecimal format. Example: 941299B2B7E1291C'
            }
        } else {
            const alias = value.substring(1)
            try {
                const ignored = new NamespaceId(alias)
            } catch (err) {
                return 'Enter valid mosaic alias. Example: @nem.xem'
            }
        }
        return true
    }
}
