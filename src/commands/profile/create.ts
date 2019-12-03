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
import { Command, command, ExpectedError, metadata, option, Options } from 'clime';
import { BlockHttp, BlockInfo, NetworkHttp, NetworkType, Password, SimpleWallet } from 'nem2-sdk';
import * as readlineSync from 'readline-sync';
import { forkJoin } from 'rxjs';
import { OptionsResolver } from '../../options-resolver';
import { WalletRepository } from '../../respository/wallet.repository';
import { WalletService } from '../../service/wallet.service';
import { NetworkValidator } from '../../validators/network.validator';
import { PrivateKeyValidator } from '../../validators/privateKey.validator';

export class CommandOptions extends Options {
    @option({
        flag: 'N',
        description: 'Wallet name.',
    })
    name: string;

    @option({
        flag: 'P',
        description: 'Wallet password',
    })
    password: string;

    @option({
        flag: 'u',
        description: 'NEM2 Node URL. Example: http://localhost:3000',
    })
    url: string;

    @option({
        flag: 'n',
        description: 'Network Type. Example: MAIN_NET, TEST_NET, MIJIN, MIJIN_TEST.',
        validator: new NetworkValidator(),
    })
    network: string;

    @option({
        flag: 'p',
        description: '(Optional) Account private key.',
        validator: new PrivateKeyValidator(),
    })
    privateKey: string;

    getNetwork(network: string): NetworkType {
        if (network === 'MAIN_NET') {
            return NetworkType.MAIN_NET;
        } else if (network === 'TEST_NET') {
            return NetworkType.TEST_NET;
        } else if (network === 'MIJIN') {
            return NetworkType.MIJIN;
        } else if (network === 'MIJIN_TEST') {
            return NetworkType.MIJIN_TEST;
        }
        throw new ExpectedError('Introduce a valid network type');
    }
}

@command({
    description: 'Create a new wallet',
})
export default class extends Command {
    private readonly walletService: WalletService;

    constructor() {
        super();
        const profileRepository = new WalletRepository('.nem2rc-wallet.json');
        this.walletService = new WalletService(profileRepository);
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
            'Introduce Wallet password: ');

        options.network = OptionsResolver(options,
            'network',
            () => undefined,
            'Introduce network type (MIJIN_TEST, MIJIN, MAIN_NET, TEST_NET): ');

        options.url = OptionsResolver(options,
            'url',
            () => undefined,
            'Introduce NEM 2 Node URL. (Example: http://localhost:3000): ');

        const networkType = options.getNetwork(options.network);

        options.name = options.name.trim();
        const networkHttp = new NetworkHttp(options.url);
        const blockHttp = new BlockHttp(options.url);
        forkJoin(networkHttp.getNetworkType(), blockHttp.getBlockByHeight('1'))
            .subscribe((res: [NetworkType, BlockInfo]) => {
                if (res[0] !== networkType) {
                    console.log('The network provided and the node network don\'t match.');
                    return;
                }
                const isWalletExist: boolean = this.walletService.checkWalletExist(options.name);
                if (isWalletExist) {
                    if (!readlineSync.keyInYN('wallet ' + options.name + ' already exist. Do you wish to recover this wallet?')) {
                        return;
                    }
                }
                const simpleWallet = SimpleWallet.create(options.name, new Password(options.password), networkType);
                const wallet = this.walletService.createWallet(
                    simpleWallet,
                    options.url,
                    res[1].generationHash);

                if (readlineSync.keyInYN('Do you want to set the wallet as the default wallet?')) {
                    this.walletService.setDefaultWallet(wallet.name);
                }
                console.log(wallet.toString());
            });
    }
}
