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
import {Validator} from 'clime'
import {AccountRestrictionFlags, MosaicRestrictionType} from 'symbol-sdk'

/**
 * Validator of mosaic restriction type
 */
export class MosaicRestrictionTypeValidator implements Validator<number> {
    /**
     * Validates if a mosaic restriction type is valid.
     * @param {number} value - Mosaic restriction type.
     * @returns {true | string}
     */
    validate(value: number): boolean | string {
        return value in MosaicRestrictionType ? true : 'Invalid mosaic restriction type'
    }
}

/**
 * Validator of account restriction flag
 */
export class AccountRestrictionFlagsValidator implements Validator<number> {
    /**
     * Validates if an account restriction flag is valid.
     * @param {number} value - account restriction flag.
     * @returns {true | string}
     */
    validate(value: number): boolean | string {
        return value in AccountRestrictionFlags ? true : 'Invalid restriction account address flag'
    }
}
