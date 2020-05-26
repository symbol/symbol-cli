/*
 *
 * Copyright 2018-present NEM
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

import { command, metadata, option } from 'clime';
import { Deadline, MetadataHttp, MetadataTransactionService, MetadataType } from 'symbol-sdk';

import { AnnounceTransactionsCommand } from '../../interfaces/announce.transactions.command';
import { AnnounceTransactionsOptions } from '../../interfaces/announceTransactions.options';
import { KeyResolver } from '../../resolvers/key.resolver';
import { MaxFeeResolver } from '../../resolvers/maxFee.resolver';
import { PasswordResolver } from '../../resolvers/password.resolver';
import { PublicKeyResolver } from '../../resolvers/publicKey.resolver';
import { StringResolver } from '../../resolvers/string.resolver';
import { TransactionSignatureOptions } from '../../services/transaction.signature.service';

export class CommandOptions extends AnnounceTransactionsOptions {
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
        const password = await new PasswordResolver().resolve(options);
        const account = profile.decrypt(password);
        const targetAccount = await new PublicKeyResolver().resolve(
            options,
            profile.networkType,
            'Enter the target account public key:',
            'targetPublicKey',
        );
        const key = await new KeyResolver().resolve(options);
        const value = await new StringResolver().resolve(options);
        const maxFee = await new MaxFeeResolver().resolve(options);
        const signerMultisigInfo = await this.getSignerMultisigInfo(options);

        const metadataHttp = profile.repositoryFactory.createMetadataRepository();
        const metadataTransactionService = new MetadataTransactionService(metadataHttp);
        const metadataTransaction = await metadataTransactionService
            .createMetadataTransaction(
                Deadline.create(),
                account.networkType,
                MetadataType.Account,
                targetAccount,
                key,
                value,
                account.publicAccount,
                undefined,
                maxFee,
            )
            .toPromise();

        const signatureOptions: TransactionSignatureOptions = {
            account,
            transactions: [metadataTransaction],
            maxFee,
            signerMultisigInfo,
            isAggregate: targetAccount.publicKey === account.publicKey,
            isAggregateBonded: targetAccount.publicKey !== account.publicKey,
        };

        const signedTransactions = await this.signTransactions(signatureOptions, options);
        this.announceTransactions(options, signedTransactions);
    }
}
