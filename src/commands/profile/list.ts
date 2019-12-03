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
import {Command, command, metadata, option, Options} from 'clime';
import { Wallet } from '../../model/wallet';
import {WalletRepository} from '../../respository/wallet.repository';
import {WalletService} from '../../service/wallet.service';

@command({
    description: 'Display the list of stored wallets',
})
export default class extends Command {
    private readonly walletService: WalletService;

    constructor() {
        super();
        const walletRepository = new WalletRepository('.nem2rc-wallet.json');
        this.walletService = new WalletService(walletRepository);
    }

    @metadata
    execute() {
        let message = '';
        this.walletService.getAllWallet().map((wallet: Wallet) => {
            message += '\n\n' + wallet.toString();
        });
        console.log(message);
        try {
            const currentWallet = this.walletService.getDefaultWallet();
            if (currentWallet) {
                console.log(chalk.green('\n\n Default profile:', currentWallet.name));
            }
        } catch {
            console.log(chalk.green('\n\n Default profile: None'));
        }
    }
}