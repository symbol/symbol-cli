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
} from '../../announce.transactions.command';
import {AnnounceResolver} from '../../resolvers/announce.resolver';
import {KeyResolver} from '../../resolvers/key.resolver';
import {MaxFeeHashLockResolver, MaxFeeResolver} from '../../resolvers/maxFee.resolver';
import {NamespaceIdResolver} from '../../resolvers/namespace.resolver';
import {TargetPublicKeyResolver} from '../../resolvers/publicKey.resolver';
import {StringResolver} from '../../resolvers/string.resolver';

export class CommandOptions extends AnnounceAggregateTransactionsOptions {
    @option({
        flag: 'n',
        description: 'Id of namespace to be assigned metadata.',
    })
    namespaceId: string;

    @option({
        flag: 't',
        description: 'Namespace id owner account public key.',
    })
    targetPublicKey: string;

    @option({
        flag: 'k',
        description: 'Key of metadata.',
    })
    key: string;

    @option({
        flag: 'v',
        description: 'Value of metadata key.',
    })
    value: string;
}

@command({
    description: 'Add custom data to a namespace',
})
export default class extends AnnounceTransactionsCommand {
    constructor() {
        super();
    }

    @metadata
    async execute(options: CommandOptions) {
        const profile = this.getProfile(options);
        const account = profile.decrypt(options);
        const namespaceId = new NamespaceIdResolver().resolve(options);
        const targetAccount = new TargetPublicKeyResolver()
            .resolve(options, profile, 'Enter the namespace owner account public key: ');
        const key = new KeyResolver().resolve(options);
        const value = new StringResolver().resolve(options);
        const maxFee = new MaxFeeResolver().resolve(options);

        const metadataHttp = new MetadataHttp(profile.url);
        const metadataTransactionService = new MetadataTransactionService(metadataHttp);
        const metadataTransaction = await metadataTransactionService.createMetadataTransaction(
            Deadline.create(),
            account.networkType,
            MetadataType.Namespace,
            targetAccount,
            key,
            value,
            account.publicAccount,
            namespaceId,
            maxFee,
        ).toPromise();
        const isAggregateComplete = (targetAccount.publicKey === account.publicKey);
        if  (isAggregateComplete) {
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
            const maxFeeHashLock = new MaxFeeHashLockResolver().resolve(options);
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
