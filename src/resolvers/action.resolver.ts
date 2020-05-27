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
import { Options } from 'clime';
import { LinkAction, MosaicSupplyChangeAction } from 'symbol-sdk';

import { ActionType } from '../models/action.enum';
import { OptionsChoiceResolver } from '../options-resolver';
import { ActionValidator, LinkActionValidator, MosaicSupplyChangeActionValidator } from '../validators/action.validator';
import { Resolver } from './resolver';

/**
 * Link action resolver
 */
export class ActionResolver implements Resolver {
    /**
     * Resolves an action provided by the user.
     * @param {Options} options - Command options.
     * @param {string} altText - Alternative text.
     * @param {string} altKey - Alternative key.
     * @returns {Promise<number>}
     */
    async resolve(options: Options, altText?: string, altKey?: string): Promise<number> {
        const choices = Object.keys(ActionType)
            .filter((key) => Number.isNaN(parseFloat(key)))
            .map((string) => ({
                title: string,
                value: ActionType[string as any],
            }));

        const value = +(await OptionsChoiceResolver(
            options,
            altKey ? altKey : 'action',
            altText ? altText : 'Select an action:',
            choices,
            'select',
            new ActionValidator(),
        ));
        return value;
    }
}

/**
 * Link action resolver
 */
export class LinkActionResolver implements Resolver {
    /**
     * Resolves an action provided by the user.
     * @param {Options} options - Command options.
     * @param {string} altText - Alternative text.
     * @param {string} altKey - Alternative key.
     * @returns {Promise<number>}
     */
    async resolve(options: Options, altText?: string, altKey?: string): Promise<number> {
        const choices = Object.keys(LinkAction)
            .filter((key) => Number.isNaN(parseFloat(key)))
            .map((string) => ({
                title: string,
                value: LinkAction[string as any],
            }));

        const value = +(await OptionsChoiceResolver(
            options,
            altKey ? altKey : 'action',
            altText ? altText : 'Select an action:',
            choices,
            'select',
            new LinkActionValidator(),
        ));
        return value;
    }
}

export class SupplyActionResolver implements Resolver {
    /**
     * Resolves an action provided by the user.
     * @param {Options} options - Command options.
     * @param {string} altText - Alternative text.
     * @param {string} altKey - Alternative key.
     * @returns {Promise<number>}
     */
    async resolve(options: Options, altText?: string, altKey?: string): Promise<number> {
        const choices = Object.keys(MosaicSupplyChangeAction)
            .filter((key) => Number.isNaN(parseFloat(key)))
            .map((string) => ({
                title: string,
                value: MosaicSupplyChangeAction[string as any],
            }));

        const value = +(await OptionsChoiceResolver(
            options,
            altKey ? altKey : 'action',
            altText ? altText : 'Select an action:',
            choices,
            'select',
            new MosaicSupplyChangeActionValidator(),
        ));
        return value;
    }
}
