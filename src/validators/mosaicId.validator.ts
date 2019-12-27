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
import {ExpectedError, ValidationContext, Validator} from 'clime';
import {MosaicId, NamespaceId} from 'nem2-sdk';

/**
 * Mosaic id validator
 */
export class MosaicIdValidator implements Validator<string> {

    /**
     * Validates if a mosaic id object can be created from a string.
     * @param {string} value - MosaicId in hexadecimal.
     * @param {ValidationContext} context
     * @throws {ExpectedError}
     */
    validate(value: string, context: ValidationContext): void {
        try {
            const ignored = new MosaicId(value);
        } catch (err) {
            throw new ExpectedError('Enter a mosaic id in hexadecimal format. Example: 941299B2B7E1291C');
        }
    }
}

/**
 * Mosaic id alias validator
 */
export class MosaicIdAliasValidator implements Validator<string> {

    /**
     * Validates if a mosaic id object can be created from a string.
     * @param {string} value - MosaicId in hexadecimal or Namespace name. If starts with '@', it is a namespace name.
     * @param {ValidationContext} context
     * @throws {ExpectedError}
     */
    validate(value: string, context: ValidationContext): void {
        const aliasTag = '@';
        if (value.charAt(0) !== aliasTag) {
            try {
                const ignored = new MosaicId(value);
            } catch (err) {
                throw new ExpectedError('Enter a mosaic id in hexadecimal format. Example: 941299B2B7E1291C');
            }
        } else {
            const alias = value.substring(1);
            try {
                const ignored = new NamespaceId(alias);
            } catch (err) {
                throw new ExpectedError('Enter valid mosaic alias. Example: @nem.xem');
            }
        }
    }
}
