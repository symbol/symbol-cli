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
import { Command, command, ExpectedError, metadata, option, Options } from 'clime';
import { OptionsResolver } from '../../options-resolver';
import { WalletRepository } from '../../respository/wallet.repository';
import { WalletService } from '../../service/wallet.service';

export class CommandOptions extends Options {
    @option({
        flag: 'N',
        description: 'Wallet name.',
    })
    name: string;

    @option({
        flag: 'P',
        description: 'Wallet password.',
    })
    password: string;
}

@command({
    description: 'Get account info',
})
export default class extends Command {
    private readonly walletService: WalletService;
    private readonly table: Table.HorizontalTable;
    constructor() {
        super();
        const walletRepository = new WalletRepository('.nem2rcWallet.json');
        this.walletService = new WalletService(walletRepository);
        this.table = new Table({
            style: { head: ['cyan'] },
            head: ['Property', 'Value'],
        }) as Table.HorizontalTable;
    }

    @metadata
    execute(options: CommandOptions) {
        options.name = OptionsResolver(options,
            'name',
            () => undefined,
            'Introduce wallet name: ');

        options.password = OptionsResolver(options,
            'password',
            () => undefined,
            'Introduce wallet password: ');

        const wallet = this.walletService.getWallet(options.name);
        const account = WalletService.getAccount(wallet, options.password);

        this.table.push(
            ['Address', account.address.pretty()],
            ['Private Key', account.privateKey],
            ['Public Key', account.publicKey],
            ['NetworkType', account.networkType],
        );
        console.log(this.table.toString());
    }
}
