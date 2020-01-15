import { command, metadata, option } from 'clime';
import { Deadline, KeyGenerator, MetadataHttp, MetadataTransactionService, MetadataType } from 'nem2-sdk';
import { AnnounceTransactionsCommand, AnnounceTransactionsOptions } from '../../announce.transactions.command';
import { KeyResolver } from '../../resolvers/key.resolver';
import { MaxFeeResolver } from '../../resolvers/maxFee.resolver';
import { NamespaceIdResolver } from '../../resolvers/namespace.resolver';
import { StringResolver } from '../../resolvers/string.resolver';

export class CommandOptions extends AnnounceTransactionsOptions {
    @option({
        flag: 'n',
        description: 'Id of namespace to be assigned metadata.',
    })
    namespaceId: string;

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
        const key = KeyGenerator.generateUInt64Key(new KeyResolver().resolve(options));
        const value = new StringResolver().resolve(options);
        const maxFee = new MaxFeeResolver().resolve(options);

        const metadataHttp = new MetadataHttp(profile.url);
        const metadataTransactionService = new MetadataTransactionService(metadataHttp);
        const namespaceMetadataTransaction = await metadataTransactionService.createMetadataTransaction(
            Deadline.create(),
            account.networkType,
            MetadataType.Namespace,
            account.publicAccount,
            key,
            value,
            account.publicAccount,
            namespaceId,
            maxFee,
        ).toPromise();

        const signedTransaction = account.sign(namespaceMetadataTransaction, profile.networkGenerationHash);
        this.announceTransaction(signedTransaction, profile.url);
    }
}
