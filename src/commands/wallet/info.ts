import { Command, command, ExpectedError, metadata, option, Options } from 'clime';
import { OptionsResolver } from '../../options-resolver';
import {WalletRepository} from '../../respository/wallet.repository';
import {WalletService} from '../../service/wallet.service';

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
    constructor() {
        super();
        const profileRepository = new WalletRepository('.nem2rcWallet.json');
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
            'Introduce wallet password: ');

        const wallet = this.walletService.getWallet(options.name);
        const account = this.walletService.getAccount(wallet, options.password);
        console.log('address: ' + account.address.pretty());
        console.log('privateKey: ' + account.privateKey);
        console.log('publicKey: ' + account.publicKey);
        console.log('networkType: ' + account.networkType);
    }
}
