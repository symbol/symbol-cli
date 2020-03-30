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
import {Choices, ConfirmOptionType, InputOptionType, SelectOptionType} from './interfaces/options.interface'
import {Validator} from './validators/validator'
import chalk from 'chalk'
import * as prompts from  'prompts'

/**
 * Passed as option to Prompt,
 * it enables a clean behaviour when an user abords a prompt serie
 */
const onCancel = () => process.exit()

export const OptionsChoiceResolver = async (options: any,
                                            key: string,
                                            promptText: string,
                                            choices: Choices[],
                                            type: SelectOptionType = 'select',
                                            validation: Validator<any> | undefined) => {
    if (options[key] !== undefined) {
        const title = options[key].trim()
        if (validation !== undefined ) {
            const test = validation.validate(title)
            if (typeof test === 'string') {
                console.log(chalk.red('ERR'), test)
                return process.exit()
            }
        }
        return choices.find((item) => item.title === title)?.value
    } else {
        return (await prompts({
            type,
            name: key,
            message: promptText,
            choices,
            validate: validation !== undefined ?
                (result) => validation.validate(result) : () => true,
        }, {onCancel}))[key]
    }
}

export const OptionsResolver = async (options: any,
                                      key: string,
                                      secondSource: () => string | undefined,
                                      promptText: string,
                                      type: InputOptionType = 'text',
                                      validation: Validator<any> | undefined) => {

    let value: string
    if (options[key] !== undefined) {
        value = typeof options[key] === 'string' ? options[key].trim() : options[key]
        if (validation !== undefined) {
            const test = validation.validate(value)
            if (typeof test === 'string') {
                console.log(chalk.red('ERR'), test)
                return process.exit()
            }
        }
    } else if (secondSource()) {
        let resolvedSecondSource = secondSource()
        value = resolvedSecondSource ? resolvedSecondSource  : ''
    } else {
        value = (await prompts({
            type,
            name: key,
            message: promptText,
            validate: validation !== undefined ?
                (result: any) => validation.validate(result) : () => true,
        }, {onCancel}))[key]
    }
    return value
}

export const OptionsConfirmResolver = async (
    options: any,
    key: string,
    promptText: string,
    type: ConfirmOptionType = 'confirm',
    initial = true,
    name = 'value'): Promise<boolean> => options[key] ? options[key] : (await prompts({
        type,
        name,
        message: promptText,
        initial,
    }, {onCancel}))[name]

