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

import * as prompts from 'prompts';
import { Choice, PromptType } from 'prompts';
import * as readlineSync from 'readline-sync';

// export const OptionsResolver = (options: any,
//                                 key: string,
//                                 secondSource: () => string | undefined,
//                                 promptText: string,
//                                 readlineDependency?: any,
//                                 hide?: boolean) => {
//     const readline = readlineDependency || readlineSync;
//     const hideEchoBack = hide ? true : false;
//     return options[key] !== undefined ? options[key] : (secondSource() ||
//         readline.question(promptText, {hideEchoBack}));
// };

export const OptionsChoiceResolver = (options: any,
                                      key: string,
                                      promptText: string,
                                      choices: string[],
                                      readlineDependency?: any) => {
    const readline = readlineDependency || readlineSync;
    if (options[key] !== undefined) {
        return options[key];
    }
    const choiceIndex = readline.keyInSelect(choices, promptText);
    if (-1 === choiceIndex) {
        return process.exit();
    }
    return choiceIndex;
};
export const EXIT_FLAG = '@EXIT';

export const OptionsResolver = async (options: any,
                                      key: string,
                                      secondSource: () => string | undefined,
                                      promptText: string,
                                      type: PromptType = 'text',
                                      choices?: Choice[]) => {
    const response = await prompts({
        type,
        name: key,
        message: promptText,
        choices,
      });
    if (('select' === type || 'multiselect' === type) && response[key].includes(EXIT_FLAG)) {
        return process.exit();
    }
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
