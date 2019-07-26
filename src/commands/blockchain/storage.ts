/*
 *
 * Copyright 2018 NEM
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
import {command, metadata} from 'clime';
import {BlockchainHttp} from 'nem2-sdk';
import {ProfileCommand, ProfileOptions} from '../../profile.command';

@command({
    description: 'Blockchain storage',
})
export default class extends ProfileCommand {

    constructor() {
        super();
    }

    @metadata
    execute(options: ProfileOptions) {
        this.spinner.start();

        const profile = this.getProfile(options);

        const blockchainHttp = new BlockchainHttp(profile.url);
        blockchainHttp.getDiagnosticStorage().subscribe((storage) => {
            this.spinner.stop(true);

            console.log('numBlocks: ' + storage.numBlocks);
            console.log('numTransactions: ' + storage.numTransactions);
            console.log('numAccounts: ' + storage.numAccounts);
        }, (err) => {
            this.spinner.stop(true);
            let text = '';
            text += chalk.red('Error');
            console.log(text, err.response !== undefined ? err.response.text : err);
        });
    }
}