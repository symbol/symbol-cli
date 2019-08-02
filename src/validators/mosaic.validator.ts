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
import {Mosaic, UInt64} from 'nem2-sdk';
import {AliasService} from '../service/alias.service';

export class MosaicValidator implements Validator<string> {
    validate(value: string, context: ValidationContext): void {
        const mosaicParts = value.split('::');
        try {
            if (isNaN(+mosaicParts[1])) {
                throw new ExpectedError('Mosaic should be in the format (mosaicId(hex)|@aliasName)::absoluteAmount,' +
                    ' (Ex: sending 1 cat.currency, @cat.currency::1000000)');
            }
            const ignored = new Mosaic(AliasService.getMosaicId(mosaicParts[0]),
                UInt64.fromUint(+mosaicParts[1]));
        } catch (err) {
            throw new ExpectedError('Mosaic should be in the format (mosaicId(hex)|@aliasName)::absoluteAmount,' +
                ' (Ex: sending 1 cat.currency, @cat.currency::1000000)');
        }
    }
}
