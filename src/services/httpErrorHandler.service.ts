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
 * Http error handler service.
 */
export class HttpErrorHandler {
    /**
     * Handle errors thrown by an HTTP call.
     * @param {any} err - err data.
     * @returns {string}
     */
    public static handleError(err: any): string {
        let result = chalk.red('Error') + ' ';
        if (err instanceof Object && 'message' in err) {
            try {
                const message = JSON.parse(err.message);
                if ('errorDetails' in message && 'statusMessage' in message.errorDetails) {
                    result += message.errorDetails.statusMessage;
                } else {
                    result += err.message;
                }
            } catch (e) {
                result += err.message;
            }
        } else {
            result += err;
        }
        return result;
    }
}
