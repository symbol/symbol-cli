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
import {command, metadata, option} from 'clime';
import {BlockHttp} from 'nem2-sdk';
import {OptionsResolver} from '../../options-resolver';
import {ProfileCommand, ProfileOptions} from '../../profile.command';
import {ReceiptService} from '../../service/receipt.service';
import {HeightValidator} from '../../validators/block.validator';

export class CommandOptions extends ProfileOptions {
    @option({
        flag: 'h',
        description: 'Block height',
        validator: new HeightValidator(),
    })
    height: number;
}

@command({
    description: 'Get the receipts triggered for a given block height',
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

        this.spinner.start();
        const profile = this.getProfile(options);
        const blockHttp = new BlockHttp(profile.url);

        blockHttp.getBlockReceipts(height)
            .subscribe((statement: any) => {
                this.spinner.stop(true);
                let txt = '';
                const receiptService = new ReceiptService();
                txt += receiptService.formatTransactionStatements(statement);
                txt += receiptService.formatAddressResolutionStatements(statement);
                txt += receiptService.formatMosaicResolutionStatements(statement);
                if ('' === txt) {
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
