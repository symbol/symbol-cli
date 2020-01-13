import { command, metadata, option } from 'clime';
import { Deadline, KeyGenerator, NamespaceMetadataTransaction } from 'nem2-sdk';
import { AnnounceTransactionsCommand, AnnounceTransactionsOptions } from '../../announce.transactions.command';
import { NamespaceIdResolver } from '../../resolvers/namespace.resolver';
import { KeyResolver, StringResolver } from '../../resolvers/string.resolver';

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
    execute(options: CommandOptions) {
        const profile = this.getProfile(options);
        const account = profile.decrypt(options);
        const namespaceId = new NamespaceIdResolver().resolve(options);
        const key = KeyGenerator.generateUInt64Key(new KeyResolver().resolve(options));
        const value = new StringResolver().resolve(options);

        const namespaceMetadataTransaction = NamespaceMetadataTransaction.create(
            Deadline.create(),
            account.publicKey,
            key,
            namespaceId,
            value.length,
            value,
            account.networkType,
        );

        const signedTransaction = account.sign(namespaceMetadataTransaction, profile.networkGenerationHash);
        this.announceTransaction(signedTransaction, profile.url);
    }
}
