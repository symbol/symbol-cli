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
        const profileRepository = new WalletRepository('.nem2rcWallet.json');
        this.walletService = new WalletService(profileRepository);
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
        const account = this.walletService.getAccount(wallet, options.password);

        this.table.push(
            ['Address', account.address.pretty()],
            ['Private Key', account.privateKey],
            ['Public Key', account.publicKey],
            ['NetworkType', account.networkType],
        );
        console.log(this.table.toString());
    }
}
