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

/**
 * Formatter service.
 */
export class FormatterService {
    /**
     * Handle sucess string.
     * @param {string} value - value to format.
     * @returns {string}
     */
    public static success(value: string): string {
        return '\n' + chalk.bgGreen.bold('SUCESS') + ' ' + value;
    }

    /**
     * Handle informative string.
     * @param {string} value - value to format.
     * @returns {string}
     */
    public static info(value: string): string {
        return '\n' + chalk.bgBlue.bold('TIP') + ' ' + value;
    }

    /**
     * Handle sucess string.
     * @param {string} value - value to format.
     * @returns {string}
     */
    public static title(value: string): string {
        return '\n' + chalk.cyan(value);
    }

    /**
     * Handle error thrown by an HTTP call.
     * @param {any} value - value to format.
     * @returns {string}
     */
    public static error(value: any): string {
        let result = '\n' + chalk.bgRed.bold('ERROR') + ' ';
        if (value instanceof Object && 'message' in value) {
            try {
                const message = JSON.parse(value.message);
                if ('valueorDetails' in message && 'statusMessage' in message.valueorDetails) {
                    result += message.valueorDetails.statusMessage;
                } else {
                    result += value.message;
                }
            } catch (e) {
                result += value.message;
            }
        } else {
            result += value;
        }
        return result;
    }
}
