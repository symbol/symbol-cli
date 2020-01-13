import { command, metadata, option } from 'clime';
import { Deadline, KeyGenerator, MosaicMetadataTransaction } from 'nem2-sdk';
import { AnnounceTransactionsCommand, AnnounceTransactionsOptions } from '../../announce.transactions.command';
import { MosaicIdAliasResolver } from '../../resolvers/mosaic.resolver';
import { KeyResolver, StringResolver } from '../../resolvers/string.resolver';

export class CommandOptions extends AnnounceTransactionsOptions {
    @option({
        flag: 'm',
        description: 'Mosaic to be assigned metadata (mosaicId(hex)|@aliasName).',
    })
    mosaic: string;

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
    description: 'Add custom data to a mosaic',
})
export default class extends AnnounceTransactionsCommand {
    constructor() {
        super();
    }

    @metadata
    execute(options: CommandOptions) {
        const profile = this.getProfile(options);
        const account = profile.decrypt(options);
        const mosaic = new MosaicIdAliasResolver().resolve(options);
        const key = KeyGenerator.generateUInt64Key(new KeyResolver().resolve(options));
        const value = new StringResolver().resolve(options);

        const mosaicMetadataTransaction = MosaicMetadataTransaction.create(
            Deadline.create(),
            account.publicKey,
            key,
            mosaic,
            value.length,
            value,
            account.networkType,
        );

        const signedTransaction = account.sign(mosaicMetadataTransaction, profile.networkGenerationHash);
        this.announceTransaction(signedTransaction, profile.url);
    }
}
