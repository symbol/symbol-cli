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
import {Spinner} from 'cli-spinner';
import {Command, ExpectedError, option, Options} from 'clime';
import {Wallet} from './model/wallet';
import {WalletRepository} from './respository/wallet.repository';
import {WalletService} from './service/wallet.service';

export abstract class WalletCommand extends Command {
    private readonly walletService: WalletService;
    public spinner = new Spinner('processing.. %s');

    constructor() {
        super();
        const walletRepository = new WalletRepository('.nem2rc-wallet.json');
        this.walletService = new WalletService(walletRepository);
        this.spinner.setSpinnerString('|/-\\');
    }

    public getDefaultWallet(options: ProfileOptions): Wallet {
        try {
            if (options.wallet) {
                return this.walletService.getWallet(options.wallet);
            }
            const wallet = this.walletService.getDefaultWallet();
            if (wallet) {
                return wallet;
            } else {
                throw new ExpectedError('Can\'t retrieve the current wallet.\n' +
                'Use \'nem2-cli wallet list\' to check whether the wallet exist, ' +
                'if not, use \'nem2-cli wallet create\' to create a new wallet.');
            }
        } catch (err) {
            throw new ExpectedError('Can\'t retrieve the current wallet.\n' +
            'Use \'nem2-cli wallet list\' to check whether the wallet exist, ' +
            'if not, use \'nem2-cli wallet create\' to create a new wallet.');
        }
    }

    protected setDefaultWallet(options: ProfileOptions) {
        try {
            this.walletService.setDefaultWallet(options.wallet);
        } catch (err) {
            throw new ExpectedError('Can\'t set the wallet [' + options.wallet + '] as the default wallet\n.' +
                'Use \'nem2-cli wallet list\' to check whether the wallet exist, ' +
                'if not, use \'nem2-cli wallet create\' to create a wallet.');
        }
    }
}

export class ProfileOptions extends Options {
    @option({
        description: '(Optional) Select between your wallets, by providing a wallet name.',
    })
    wallet: string;
}
