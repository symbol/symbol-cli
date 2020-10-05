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
import { ChainInfo } from 'symbol-sdk';

import { ProfileCommand } from '../../interfaces/profile.command';
import { ProfileOptions } from '../../interfaces/profile.options';
import { FormatterService } from '../../services/formatter.service';

export class ChainInfoTable {
  private readonly table: HorizontalTable;
  constructor(public readonly chainInfo: ChainInfo) {
      this.table = new Table({
          style: { head: ['cyan'] },
          head: ['Property', 'Value'],
      }) as HorizontalTable;
      this.table.push(
          ['Height', chainInfo.height.toString()],
          ['Score Low', chainInfo.scoreLow.toString()],
          ['Score High', chainInfo.scoreHigh.toString()],
          ['Latest Finalized Block Height', chainInfo.latestFinalizedBlock.height.toString()],
          ['Latest Finalized Block Hash', chainInfo.latestFinalizedBlock.hash],
      );
  }

  toString(): string {
      let text = '';
      text += FormatterService.title('Chain Information');
      text += '\n' + this.table.toString();
      return text;
  }
}

@command({
    description: 'Get the current information of the chain',
})
export default class extends ProfileCommand {
    constructor() {
        super();
    }

    @metadata
    execute(options: ProfileOptions) {
        const profile = this.getProfile(options);

        this.spinner.start();
        const chainHttp = profile.repositoryFactory.createChainRepository();
        chainHttp.getChainInfo().subscribe(
            (info: ChainInfo) => {
                this.spinner.stop();
                console.log(
                  new ChainInfoTable(info).toString()
                );
            },
            (err: any) => {
                this.spinner.stop();
                console.log(FormatterService.error(err));
            },
        );
    }
}
