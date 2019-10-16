import chalk from 'chalk';
import { command, metadata, option } from 'clime';
import {
    Account,
    Address,
    BlockHttp,
    Deadline,
    Mosaic,
    MosaicId,
    SecretLockTransaction,
    TransactionHttp,
    UInt64,
} from 'nem2-sdk';
import { AnnounceTransactionsCommand, AnnounceTransactionsOptions } from '../../announce.transactions.command';
import { OptionsResolver } from '../../options-resolver';
import { SecretLockService } from '../../service/secretlock.service';
import { AddressValidator } from '../../validators/address.validator';
import { HashAlgorithmValidator } from '../../validators/hashAlgorithm.Validator';
import { MosaicIdValidator } from '../../validators/mosaicId.validator';
import { NetworkValidator } from '../../validators/network.validator';

export class CommandOptions extends AnnounceTransactionsOptions {
    @option({
        description: 'Locked mosaic ID.',
        flag: 'm',
        validator: new MosaicIdValidator(),
    })
    mosaicId: string;

    @option({
        description: '(Optional) Amount to lock.',
        flag: 'a',
        default: 10,
    })
    amount: number;

    @option({
        description: 'Number of blocks for which a lock should be valid. ' +
            'Duration is allowed to lie up to 30 days. If reached, the mosaics will be returned to the initiator.',
        flag: 'd',
    })
    duration: number;

    @option({
        description: 'Algorithm used to hash the proof(0: Op_Sha3_256, 1: Op_Keccak_256, 2: Op_Hash_160, 3: Op_Hash_256). ',
        flag: 'H',
        validator: new HashAlgorithmValidator(),
    })
    hashAlgorithm: number;

    @option({
        description: 'Proof hashed. ',
        flag: 's',
    })
    secret: string;

    @option({
        description: 'Address that receives the funds once unlocked. ',
        flag: 'r',
        validator: new AddressValidator(),
    })
    recipientAddress: string;

    @option({
        description: 'The private key of your account on the other chain. ',
        flag: 'p',
    })
    privateKey: string;

    @option({
        description: 'The url of the other chain. ',
        flag: 'u',
    })
    url: string;

    @option({
        description: 'The network type of the other chain. (MAIN_NET, TEST_NET, MIJIN, MIJIN_TEST)',
        flag: 'n',
        validator: new NetworkValidator(),
    })
    networkType: string;
}

@command({
    description: ' Creates a secretLock transaction ',
})
export default class extends AnnounceTransactionsCommand {
    constructor() {
        super();
    }

    @metadata
    execute(options: CommandOptions) {
        options.mosaicId = OptionsResolver(options,
            'mosaicId',
            () => undefined,
            'Introduce the locked mosaic ID: ');

        options.duration = OptionsResolver(options,
            'duration',
            () => undefined,
            'Number of blocks for which a lock should be valid: ');

        options.hashAlgorithm = OptionsResolver(options,
            'hashAlgorithm',
            () => undefined,
            'Introduce algorithm used to hash the proof(0: Op_Sha3_256, 1: Op_Keccak_256, 2: Op_Hash_160, 3: Op_Hash_256): ');

        options.secret = OptionsResolver(options,
            'secret',
            () => undefined,
            'Introduce proof hashed: ');
        options.recipientAddress = OptionsResolver(options,
            'recipientAddress',
            () => undefined,
            'Introduce proof hashed: ');
        options.privateKey = OptionsResolver(options,
            'privateKey',
            () => undefined,
            'Introduce the private key of your account on the other chain: ');
        options.url = OptionsResolver(options,
            'url',
            () => undefined,
            'Introduce the url of the other chain: ');
        options.networkType = OptionsResolver(options,
            'networkType',
            () => undefined,
            'Introduce the network type of the other chain: (MAIN_NET, TEST_NET, MIJIN, MIJIN_TEST)');

        const profile = this.getProfile(options);

        const otherChainAccount = Account.createFromPrivateKey(options.privateKey, profile.networkType);

        const secretLockService = new SecretLockService();
        const {proof, secret} = secretLockService.createSecret();

        console.log(chalk.green('proof: ') + proof + '\n');
        console.log(chalk.green('secret: ') + secret + '\n');

        const networkType = secretLockService.getNetworkType(options.networkType);
        const cryptoType = secretLockService.getCryptoType(options.hashAlgorithm);

        const secretLockTransaction = SecretLockTransaction.create(
            Deadline.create(),
            new Mosaic(new MosaicId(options.mosaicId),
            UInt64.fromUint(options.amount)),
            UInt64.fromUint(options.duration),
            cryptoType,
            secret,
            Address.createFromRawAddress(options.recipientAddress),
            networkType);

        const blockHttp = new BlockHttp(options.url);
        const privateChainTransactionHttp = new TransactionHttp(options.url);
        blockHttp.getBlockByHeight(1).subscribe((blockInfo) => {
            const secretLockTransactionSigned = otherChainAccount.sign(secretLockTransaction, blockInfo.generationHash);
            privateChainTransactionHttp
                .announce(secretLockTransactionSigned)
                .subscribe(
                    (x) => console.log(x),
                    (err) => console.error(err),
                );
        }, (err) => {
            this.spinner.stop(true);
            let text = '';
            text += chalk.red('Error');
            console.log(text, err.response !== undefined ? err.response.text : err);
        });
    }

}
