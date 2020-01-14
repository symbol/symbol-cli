import { command, metadata, option } from 'clime';
import {
    AggregateTransaction,
    Deadline,
    HashLockTransaction,
    KeyGenerator,
    MetadataHttp,
    MetadataTransactionService,
    MetadataType,
    NetworkCurrencyMosaic,
    PublicAccount,
    UInt64,
} from 'nem2-sdk';
import { AnnounceTransactionsCommand, AnnounceTransactionsOptions } from '../../announce.transactions.command';
import { MaxFeeResolver } from '../../resolvers/maxFee.resolver';
import { TargetPublicKeyResolver } from '../../resolvers/publicKey.resolver';
import { KeyResolver, StringResolver } from '../../resolvers/string.resolver';

export class CommandOptions extends AnnounceTransactionsOptions {
    @option({
        flag: 't',
        description: 'Metadata target public key.',
    })
    targetPublicKey: string;

    @option({
        flag: 'k',
        description: 'Metadata key scoped to source, target and type.',
    })
    key: string;

    @option({
        flag: 'v',
        description: 'Metadata value.',
    })
    value: string;

    @option({
        flag: 'd',
        description: '(Optional) Duration of hash lock.',
        default: 480,
    })
    duration: number;

    @option({
        flag: 'l',
        description: 'Lock fee.',
        default: 10,
    })
    lockFee: number;
}

@command({
    description: 'Add custom data to an account',
})
export default class extends AnnounceTransactionsCommand {
    constructor() {
        super();
    }

    @metadata
    async execute(options: CommandOptions) {
        const profile = this.getProfile(options);
        const account = profile.decrypt(options);
        const targetAccount = PublicAccount.createFromPublicKey(new TargetPublicKeyResolver().resolve(options), account.networkType);
        const key = KeyGenerator.generateUInt64Key(new KeyResolver().resolve(options));
        const value = new StringResolver().resolve(options);
        const maxFee = new MaxFeeResolver().resolve(options);

        const metadataHttp = new MetadataHttp(profile.url);
        const metadataTransactionService = new MetadataTransactionService(metadataHttp);
        const accountMetadataTransaction = await metadataTransactionService.createMetadataTransaction(
            Deadline.create(),
            account.networkType,
            MetadataType.Account,
            targetAccount,
            key,
            value,
            account.publicAccount,
            undefined,
            maxFee,
        ).toPromise();

        const aggregateTransaction = AggregateTransaction.createBonded(
            Deadline.create(),
            [accountMetadataTransaction.toAggregate(account.publicAccount)],
            account.networkType,
            [],
            maxFee,
        );

        const signedTransaction = account.sign(aggregateTransaction, profile.networkGenerationHash);
        const duration = UInt64.fromUint(options.duration);
        const hashLockTransaction = HashLockTransaction.create(
            Deadline.create(),
            NetworkCurrencyMosaic.createRelative(UInt64.fromNumericString(String(options.lockFee))),
            duration,
            signedTransaction,
            account.networkType,
            maxFee,
        );

        const signedHashLockTransaction = account.sign(hashLockTransaction, profile.networkGenerationHash);
        this.announceAggregateTransaction(signedHashLockTransaction, signedTransaction, account.address, profile.url);
    }
}
