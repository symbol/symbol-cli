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
import {MosaicService} from '../services/mosaic.service'
import {Validator} from 'clime'

/**
 * Mosaic validator
 */
export class MosaicValidator implements Validator<string> {

    /**
     * Validates if a mosaic object can be created from a string.
     * @param {string} value - Mosaic in the form mosaicId::amount.
     * @returns {true | string}
     */
    validate(value: string): boolean | string {
        return MosaicService.validate(value)
    }
}

/**
 * Mosaics validator
 */
export class MosaicsValidator implements Validator<string> {

    /**
     * Validates if an array of mosaic objects can be created from a string.
     * @param {string} value - Mosaics in the form mosaicId::amount, separated by commas.
     * @returns {true | string}
     */
    validate(value: string): boolean | string {
        const mosaics = value.split(',')
        let error = ''
        mosaics.forEach((mosaic) => {
            const validation = MosaicService.validate(mosaic)
            if (typeof validation === 'string') {error = validation}
        })
        if (!error) {return true}
        return error
    }
}
