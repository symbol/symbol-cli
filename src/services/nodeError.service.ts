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
import chalk from 'chalk'

export class NodeErrorService {
    /**
     * Handle connect ECONNREFUSED error.
     * @param {any} err - err data.
     * @returns {string}
     */
    public static connectErrorHandler(err: any): string {
        const regexp = /^(Error: )?connect ECONNREFUSED/g
        if (err.message.match(regexp)) {
            const nodeIP = err.message.replace(regexp, '').trim()
            return '\nError: Can\'t reach the node: ' + nodeIP
        }
        err = err.message ? JSON.parse(err.message) : err
        return chalk.red('Error') + err.body && err.body.message ? err.body.message : err
    }
}
