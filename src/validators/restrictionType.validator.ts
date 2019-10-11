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
import { ExpectedError, ValidationContext, Validator } from 'clime';

export class AccountRestrictionDirectionValidator implements Validator<string> {
    validate(value: string, context: ValidationContext): void {
        value = value.toLowerCase();
        if ('incoming' !== value && 'outgoing' !== value) {
            throw new ExpectedError('restrictionDirection must be one of \'incoming\' or \'outgoing\'');
        }
    }
}

export class AccountRestrictionTypeValidator implements Validator<string> {
    validate(value: string, context: ValidationContext): void {
        value = value.toLowerCase();
        if ('allow' !== value && 'block' !== value) {
            throw new ExpectedError('restrictionType must be one of \'allow\' or \'block\'');
        }
    }
}
