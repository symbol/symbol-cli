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
import chalk from 'chalk';
import * as prompts from 'prompts';
import { Choice, PromptType } from 'prompts';

export const EXIT_FLAG = '@EXIT';

export const OptionsChoiceResolver = async (options: any,
                                            key: string,
                                            promptText: string,
                                            choices: Choice[],
                                            type: PromptType = 'select') => {
    if (!['select', 'multiselect'].includes(type)) {
        console.log(chalk.red('ERR'), 'Invalid options choice resolver type');
        return process.exit();
    }
    if (options[key] !== undefined) {
        return options[key];
    }
    const response = await prompts({
        type,
        name: key,
        message: promptText,
        choices,
    });
    if (response[key] === undefined) {
        return process.exit();
    }

    if (('select' === type && EXIT_FLAG === response[key]) || ('multiselect' === type && response[key].includes(EXIT_FLAG))) {
        return process.exit();
    }
    return response[key];
};

export const OptionsResolver = async (options: any,
                                      key: string,
                                      secondSource: () => string | undefined,
                                      promptText: string,
                                      type: PromptType = 'text') => {
    if (!['text', 'password', 'number'].includes(type)) {
        console.log(chalk.red('ERR'), 'Invalid options resolver type');
        return process.exit();
    }
    const response = await prompts({
        type,
        name: key,
        message: promptText,
    });
    return options[key] !== undefined ? options[key] : (secondSource() || response[key]);
};

export const OptionsConfirmResolver = async (promptText: string,
                                             type: PromptType = 'confirm',
                                             initial: boolean = true,
                                             name: string = 'value') => {
    const response = await prompts({
        type,
        name,
        message: promptText,
        initial,
      });
    return response[name];
};
