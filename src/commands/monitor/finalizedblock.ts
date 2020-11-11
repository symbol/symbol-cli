/*
 *
 * Copyright 2020-present NEM
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
import { FinalizedBlock } from 'symbol-sdk';
import { ProfileCommand } from '../../interfaces/profile.command';
import { ProfileOptions } from '../../interfaces/profile.options';
import { FormatterService } from '../../services/formatter.service';

export class FinalizedBlockTable {
    private readonly table: HorizontalTable;
    constructor(public readonly finalizedBlock: FinalizedBlock) {
        this.table = new Table({
            style: { head: ['cyan'] },
            head: ['Property', 'Value'],
        }) as HorizontalTable;
        this.table.push(
            ['Height:', finalizedBlock.height.toString()],
            ['Hash:', finalizedBlock.hash],
            ['Finalization Point:', finalizedBlock.finalizationPoint.toString()],
            ['Finalization Epoch:', finalizedBlock.finalizationEpoch.toString()],
        );
    }

    toString(): string {
        let text = '';
        text += FormatterService.title('Finalized Block');
        text += '\n' + this.table.toString();
        return text;
    }
}

@command({
    description: 'Monitor finalized blocks',
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
                listener.finalizedBlock().subscribe(
                    (finalizedBlock) => {
                        console.log(new FinalizedBlockTable(finalizedBlock).toString());
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
