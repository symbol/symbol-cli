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
import {MosaicId} from 'nem2-sdk';

export class MosaicIdValidator implements Validator<string> {
    validate(value: string, context: ValidationContext): void {
        try {
            const ignored = new MosaicId(value);
        } catch (err) {
            throw new ExpectedError('Introduce a mosaic id in hexadecimal format. Example: 941299B2B7E1291C');
        }
    }
}
