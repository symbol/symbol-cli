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
import * as Table from 'cli-table3';
import { HorizontalTable } from 'cli-table3';
import { command, metadata } from 'clime';
import { NetworkType, NewBlock } from 'symbol-sdk';

import { ProfileCommand } from '../../interfaces/profile.command';
import { ProfileOptions } from '../../interfaces/profile.options';
import { FormatterService } from '../../services/formatter.service';

export class NewBlockTable {
    private readonly table: HorizontalTable;
    constructor(public readonly blockInfo: NewBlock) {
        this.table = new Table({
            style: { head: ['cyan'] },
            head: ['Property', 'Value'],
        }) as HorizontalTable;
        this.table.push(
            ['Hash:', blockInfo.hash],
            ['Signature:', blockInfo.signature.slice(0, 64) + '\n' + blockInfo.signature.slice(64, 128)],
            ['Signer:', blockInfo.signer.publicKey],
            ['Network Type:', NetworkType[blockInfo.networkType]],
            ['Version:', blockInfo.version],
            ['Height:', blockInfo.height.toString()],
        );
        if (blockInfo.beneficiaryAddress) {
            this.table.push(['Beneficiary Address', blockInfo.beneficiaryAddress.pretty()]);
        }
    }

    toString(): string {
        let text = '';
        text += FormatterService.title('New Block');
        text += '\n' + this.table.toString();
        return text;
    }
}

@command({
    description: 'Monitor new blocks',
})
export default class extends ProfileCommand {
    constructor() {
        super();
    }

    @metadata
    execute(options: ProfileOptions) {
        const profile = this.getProfile(options);

        console.log(`Using ${profile.url}`);
        const listener = profile.repositoryFactory.createListener();
        listener.open().then(
            () => {
                listener.newBlock().subscribe(
                    (block) => {
                        console.log(new NewBlockTable(block).toString());
                    },
                    (err) => {
                        console.log(FormatterService.error(err));
                        listener.close();
                    },
                );
            },
            (err) => {
                this.spinner.stop();
                console.log(FormatterService.error(err));
            },
        );
    }
}
