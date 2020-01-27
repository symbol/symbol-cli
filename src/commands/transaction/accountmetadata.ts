import {command, metadata, option} from 'clime';
import {
    AggregateTransaction,
    Deadline,
    HashLockTransaction,
    MetadataHttp,
    MetadataTransactionService,
    MetadataType,
    NetworkCurrencyMosaic,
    UInt64,
} from 'nem2-sdk';
import {
    AnnounceAggregateTransactionsOptions,
    AnnounceTransactionFieldsTable,
    AnnounceTransactionsCommand,
} from '../../interfaces/announce.transactions.command';
import {AnnounceResolver} from '../../resolvers/announce.resolver';
import {KeyResolver} from '../../resolvers/key.resolver';
import {MaxFeeResolver} from '../../resolvers/maxFee.resolver';
import {PublicKeyResolver} from '../../resolvers/publicKey.resolver';
import {StringResolver} from '../../resolvers/string.resolver';

export class CommandOptions extends AnnounceAggregateTransactionsOptions {
    @option({
        flag: 't',
        description: 'Metadata target public key.',
    })
    targetPublicKey: string;

    @option({
        flag: 'k',
        description: 'Metadata key (UInt64) in hexadecimal format.',
    })
    key: string;

    @option({
        flag: 'v',
        description: 'Metadata value.',
    })
    value: string;
}

@command({
    description: 'Add custom data to an account (requires internet)',
})
export default class extends AnnounceTransactionsCommand {
    constructor() {
        super();
    }

    @metadata
    async execute(options: CommandOptions) {
        const profile = this.getProfile(options);
        const account = profile.decrypt(options);
        const targetAccount = new PublicKeyResolver()
            .resolve(options, profile.networkType,
                'Enter the target account public key: ', 'targetPublicKey');
        const key = new KeyResolver().resolve(options);
        const value = new StringResolver().resolve(options);
        const maxFee = new MaxFeeResolver().resolve(options);

        const metadataHttp = new MetadataHttp(profile.url);
        const metadataTransactionService = new MetadataTransactionService(metadataHttp);
        const metadataTransaction = await metadataTransactionService.createMetadataTransaction(
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

        const isAggregateComplete = (targetAccount.publicKey === account.publicKey);
        if (isAggregateComplete) {
            const aggregateTransaction = AggregateTransaction.createComplete(
                Deadline.create(),
                [metadataTransaction.toAggregate(account.publicAccount)],
                account.networkType,
                [],
                maxFee,
            );
            const signedTransaction = account.sign(aggregateTransaction, profile.networkGenerationHash);
            console.log(new AnnounceTransactionFieldsTable(signedTransaction, profile.url)
                .toString('Aggregate Transaction'));
            console.log(new AnnounceTransactionFieldsTable(signedTransaction, profile.url)
                .toString('Aggregate Transaction'));
            const shouldAnnounce = new AnnounceResolver().resolve(options);
            if (shouldAnnounce && options.sync) {
                this.announceTransactionSync(
                    signedTransaction,
                    account.address,
                    profile.url);
            } else if (shouldAnnounce) {
                this.announceTransaction(
                    signedTransaction,
                    profile.url);
            }
        } else {
            const aggregateTransaction = AggregateTransaction.createBonded(
                Deadline.create(),
                [metadataTransaction.toAggregate(account.publicAccount)],
                account.networkType,
                [],
                maxFee,
            );
            const signedTransaction = account.sign(aggregateTransaction, profile.networkGenerationHash);

            const maxFeeHashLock = new MaxFeeResolver().resolve(options, undefined,
                'Enter the maximum fee to announce the hashlock transaction (absolute amount): ', 'maxFeeHashLock');
            const hashLockTransaction = HashLockTransaction.create(
                Deadline.create(),
                NetworkCurrencyMosaic.createRelative(UInt64.fromNumericString(options.amount)),
                UInt64.fromNumericString(options.duration),
                signedTransaction,
                profile.networkType,
                maxFeeHashLock);
            const signedHashLockTransaction = account.sign(hashLockTransaction, profile.networkGenerationHash);

            console.log(new AnnounceTransactionFieldsTable(signedHashLockTransaction, profile.url)
                .toString('HashLock Transaction'));
            console.log(new AnnounceTransactionFieldsTable(signedTransaction, profile.url)
                .toString('Aggregate Transaction'));
            const shouldAnnounce = new AnnounceResolver().resolve(options);
            if (shouldAnnounce) {
                this.announceAggregateTransaction(
                    signedHashLockTransaction,
                    signedTransaction,
                    account.address,
                    profile.url);
            }
        }
    }
}
