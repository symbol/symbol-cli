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
import {HorizontalTable} from 'cli-table3';
import {Account, NetworkType} from 'nem2-sdk';

export class Profile {
    private readonly table: HorizontalTable;

    constructor(public readonly account: Account,
                public readonly networkType: NetworkType,
                public readonly url: string,
                public readonly name: string,
                public readonly networkGenerationHash: string) {
        this.table = new Table({
            style: {head: ['cyan']},
            head: ['Property', 'Value'],
        }) as HorizontalTable;
        this.table.push(
            ['Name', this.name],
            ['Network', NetworkType[this.networkType]],
            ['Address', this.account.address.plain()],
            ['Public Key', this.account.publicKey],
            ['Private Key', this.account.privateKey],
        );

    }
    toString(): string {
        return this.table.toString();
    }
}
