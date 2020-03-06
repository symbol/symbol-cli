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
import {ActionType} from '../models/action.enum'
import {Validator} from './validator'
import {LinkAction, MosaicSupplyChangeAction} from 'symbol-sdk'

/**
 * Action validator
 */
export class ActionValidator implements Validator<string> {

    /**
     * Validates if an action is valid.
     * @param {number} value - Action type.
     * @returns {true | string}
     */
    validate(value: string): boolean | string {
        const keys = Object.keys(ActionType)
            .filter((key) => Number.isNaN(parseFloat(key)))
        return keys.includes(value) ? true : 'ActionType must be one of (' + keys + ').'
    }
}

/**
 * LinkAction validator
 */
export class LinkActionValidator implements Validator<string> {

    /**
     * Validates if a link action is valid.
     * @param {number} value - LinkAction type.
     * @returns {true | string}
     */
    validate(value: string): boolean | string {
        const keys = Object.keys(LinkAction)
            .filter((key) => Number.isNaN(parseFloat(key)))
        return keys.includes(value) ? true : 'LinkAction must be one of (' + keys + ').'
    }
}

export class MosaicSupplyChangeActionValidator implements Validator<string> {

    /**
     * Validates if a mosaic supply change action is valid.
     * @param {number} value - MosaicSupplyChangeAction type.
     * @returns {true | string}
     */
    validate(value: string): boolean | string {
        const keys = Object.keys(MosaicSupplyChangeAction)
            .filter((key) => Number.isNaN(parseFloat(key)))
        return keys.includes(value) ? true : 'MosaicSupplyChangeAction must be one of (' + keys + ').'
    }
}
