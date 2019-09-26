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
import * as Table from 'cli-table3';
import {HorizontalTable} from 'cli-table3';
import {command, metadata} from 'clime';
import {BlockchainScore, ChainHttp} from 'nem2-sdk';
import {ProfileCommand, ProfileOptions} from '../../profile.command';

export class ChainScoreTable {
    private readonly table: HorizontalTable;
    constructor(public readonly score: BlockchainScore) {
        this.table = new Table({
            style: {head: ['cyan']},
            head: ['Property', 'Value'],
        }) as HorizontalTable;
        this.table.push(
            ['Score Low', score.scoreLow.compact()],
            ['Score High', score.scoreHigh.compact()],
        );
    }

    toString(): string {
        let text = '';
        text += '\n\n' + chalk.green('Storage Information') + '\n';
        text += this.table.toString();
        return text;
    }
}

@command({
    description: 'Gets the current score of the chain',
})
export default class extends ProfileCommand {

    constructor() {
        super();
    }

    @metadata
    execute(options: ProfileOptions) {
        this.spinner.start();

        const profile = this.getProfile(options);

        const chainHttp = new ChainHttp(profile.url);
        chainHttp.getChainScore().subscribe((score) => {
            this.spinner.stop(true);
            console.log(new ChainScoreTable(score).toString());
        }, (err) => {
            this.spinner.stop(true);
            let text = '';
            text += chalk.red('Error');
            console.log(text, err.response !== undefined ? err.response.text : err);
        });
    }
}
