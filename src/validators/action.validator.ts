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
import {ExpectedError, ValidationContext, Validator} from 'clime'
import {ActionType} from '../interfaces/action.resolver'
import {LinkAction, MosaicSupplyChangeAction} from 'nem2-sdk'

/**
 * Action validator
 */
export class ActionValidator implements Validator<number> {

    /**
     * Validates if an action is valid.
     * @param {number} value - Action type.
     * @param {ValidationContext} context
     * @throws {ExpectedError}
     */
    validate(value: number, context?: ValidationContext): void {
        if (!(value in ActionType)) {
            throw new ExpectedError('Enter a valid action. Add(1) or Remove(0)')
        }
    }
}

/**
 * LinkAction validator
 */
export class LinkActionValidator implements Validator<number> {

    /**
     * Validates if a link action is valid.
     * @param {number} value - LinkAction type.
     * @param {ValidationContext} context
     * @throws {ExpectedError}
     */
    validate(value: number, context?: ValidationContext): void {
        if (!(value in LinkAction)) {
            throw new ExpectedError('Enter a valid action. Link(1) or Unlink(0)')
        }
    }
}

export class MosaicSupplyChangeActionValidator implements Validator<number> {

    /**
     * Validates if a mosaic supply change action is valid.
     * @param {number} value - MosaicSupplyChangeAction type.
     * @param {ValidationContext} context
     * @throws {ExpectedError}
     */
    validate(value: number, context?: ValidationContext): void {
        if (!(value in MosaicSupplyChangeAction)) {
            throw new ExpectedError('Enter a valid action. Increase(1) or Decrease(0)')
        }
    }
}
