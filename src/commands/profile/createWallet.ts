import { Command, command, ExpectedError, metadata, option, Options } from 'clime';
import {Account, BlockHttp, NetworkHttp, NetworkType, Password, SimpleWallet} from 'nem2-sdk';
import {OptionsResolver} from '../../options-resolver';
import { NetworkValidator } from '../../validators/network.validator';
import { PrivateKeyValidator } from '../../validators/privateKey.validator';

export class CommandOptions extends Options {
    @option({
        flag: 'n',
        description: 'Wallet name.',
    })
    name: string;

    @option({
        flag: 'P',
        description: 'Wallet password',
    })
    password: string;

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
    description: 'Create a new profile',
})
export default class extends Command {
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

        const networkType = options.getNetwork(options.network);

        const simpleWallet = SimpleWallet.create(options.name, new Password(options.password), networkType);

        // save wallet
        
    }
}
