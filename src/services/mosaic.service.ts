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

import {Mosaic, MosaicId, NamespaceId, UInt64} from 'symbol-sdk'

/**
 * Mosaic service
 */
export class MosaicService {

    public static ALIAS_TAG = '@'

    /**
     * Constructor
     */
    constructor() {}

    /**
     * Validates a mosaic object from a string.
     * @param {string} value - Mosaic in the form mosaicId::amount.
     * @returns {true | string}
     */
    static validate(value: string) {
        const mosaicParts = value.split('::')
        let valid = true
        try {
            if (isNaN(+mosaicParts[1])) {
                valid = false
            }
            const ignored = new Mosaic(this.getMosaicId(mosaicParts[0]),
                UInt64.fromUint(+mosaicParts[1]))
        } catch (err) {
            valid = false
        }
        if (!valid) {
            return 'Mosaic should be in the format (mosaicId(hex)|@aliasName)::absoluteAmount,' +
                ' (Ex: sending 1 symbol.xym, @symbol.xym::1000000)'
        }
        return valid
    }

    /**
     * Creates a MosaicId object from a string.
     * @param {string} rawMosaicId - Mosaic identifier. If starts with "@", it is a namespace name.
     * @returns {MosaicId | NamespaceId}
     */
    static getMosaicId(rawMosaicId: string): MosaicId | NamespaceId {
        let mosaicId: MosaicId | NamespaceId
        if (rawMosaicId.charAt(0) === MosaicService.ALIAS_TAG) {
            mosaicId = new NamespaceId(rawMosaicId.substring(1))
        } else {
            mosaicId = new MosaicId(rawMosaicId)
        }
        return mosaicId
    }

    /**
     * Creates an array of mosaics from a string.
     * @param {string} rawMosaics - Mosaics in the form mosaicId::amount, separated by commas.
     * @returns {Mosaic[]}
     */
    static getMosaics(rawMosaics: string): Mosaic[] {
        const mosaics: Mosaic[] = []
        const mosaicsData = rawMosaics.split(',')
        mosaicsData.forEach((mosaicData) => {
                const mosaicParts = mosaicData.split('::')
                mosaics.push(new Mosaic(this.getMosaicId(mosaicParts[0]),
                    UInt64.fromNumericString(mosaicParts[1])))
            })
        return mosaics
    }
}
