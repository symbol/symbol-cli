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
import {LinkAction, MosaicSupplyChangeAction} from 'symbol-sdk'
import {Validator} from './validator'

/**
 * Action validator
 */
export class ActionValidator implements Validator<number> {

    /**
     * Validates if an action is valid.
     * @param {number} value - Action type.
     * @returns {true | string}
     */
    validate(value: number): boolean | string {
        return value in ActionType ? true : 'Enter a valid action. (Add, Remove)'
    }
}

/**
 * LinkAction validator
 */
export class LinkActionValidator implements Validator<number> {

    /**
     * Validates if a link action is valid.
     * @param {number} value - LinkAction type.
     * @returns {true | string}
     */
    validate(value: number): boolean | string {
        return value in LinkAction ? true : 'Enter a valid action. (Link, Unlink)'
    }
}

export class MosaicSupplyChangeActionValidator implements Validator<number> {

    /**
     * Validates if a mosaic supply change action is valid.
     * @param {number} value - MosaicSupplyChangeAction type.
     * @returns {true | string}
     */
    validate(value: number): boolean | string {
        return value in MosaicSupplyChangeAction ? true : 'Enter a valid action. (Increase, Decrease)'
    }
}
