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
import {command, ExpectedError, metadata, option} from 'clime';
import {BlockHttp, QueryParams} from 'nem2-sdk';
import {OptionsResolver} from '../../options-resolver';
import {ProfileCommand, ProfileOptions} from '../../profile.command';

export class CommandOptions extends ProfileOptions {
    @option({
        flag: 'h',
        description: 'Block height',
    })
    height: number;

    @option({
        flag: 's',
        description: 'Page size between 10 and 100, otherwise 10',
    })
    pageSize: number;
}

@command({
    description: 'Gets transactions for a given block height',
})

export default class extends ProfileCommand {

    constructor() {
        super();
    }

    @metadata
    execute(options: CommandOptions) {
        let height: number;
        height =  OptionsResolver(options,
            'height',
            () => undefined,
            'Introduce the block height: ');
        if (height < 1) {
            throw new ExpectedError('Block height introduce error');
        }

        let pageSize: number;
        pageSize =  OptionsResolver(options,
            'pageSize',
            () => undefined,
            'Introduce the Gets transactions pageSize(PageSize between 10 and 100, otherwise 10): ');
        if (!pageSize || pageSize < 10) {
            pageSize = 10;
        } else if (pageSize > 100) {
            pageSize = 10;
        }

        this.spinner.start();
        const profile = this.getProfile(options);
        const blockHttp = new BlockHttp(profile.url);

        blockHttp.getBlockTransactions(height, new QueryParams(pageSize)).subscribe((transacitons: any) => {
            this.spinner.stop(true);
            let txt = `\n`;
            if (transacitons.length > 0) {
                transacitons.map((transaction: any, index: number) => {
                    txt += '(' + (index + 1) + ')' + '. \n\t';
                    for (let i in transaction) {
                        if (typeof transaction[i] === 'object') {
                            txt += i + ':' + JSON.stringify(transaction[i]) + '\n\t';
                        } else if (typeof transaction[i] !== 'function') {
                            txt += i + ':' + transaction[i] + '\n\t';
                        }
                    }
                    txt += '\n';
                });
            } else {
                txt = '[]';
            }

            console.log(txt);
        }, (err) => {
            this.spinner.stop(true);
            let text = '';
            text += chalk.red('Error');
            console.log(text, err.response !== undefined ? err.response.text : err);
        });
    }
}
