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
import { AggregateTransaction, Convert, CosignatureSignedTransaction, Transaction, TransactionGroup, TransactionMapping } from 'symbol-sdk';
import { AnnounceTransactionsOptions } from '../../interfaces/announce.transactions.options';
import { ProfileCommand } from '../../interfaces/profile.command';
import { Profile } from '../../models/profile.model';
import { OptionsResolver } from '../../options-resolver';
import { HashResolver } from '../../resolvers/hash.resolver';
import { PasswordResolver } from '../../resolvers/password.resolver';
import { TransactionInputType, TransactionInputTypeResolver } from '../../resolvers/transactionInputType.resolver';
import { FormatterService } from '../../services/formatter.service';
import { TransactionView } from '../../views/transactions/details/transaction.view';

export class CommandOptions extends AnnounceTransactionsOptions {
    @option({
        flag: 'i',
        description: 'Transaction input type (hash or payload).',
    })
    transactionInputType: string;

    @option({
        flag: 'h',
        description: 'Aggregate bonded transaction hash to be signed.',
    })
    hash: string;

    @option({
        flag: 'p',
        description: 'Aggregate transaction payload to be signed (hex string).',
    })
    payload: string;
}

@command({
    description: 'Cosign an aggregate bonded transaction',
})
export default class extends ProfileCommand {
    private profile: Profile;
    private options: CommandOptions;

    constructor() {
        super();
    }

    @metadata
    async execute(options: CommandOptions) {
        this.options = options;
        this.profile = this.getProfile(this.options);
        const txInputType = await new TransactionInputTypeResolver().resolve(options);
        if (txInputType === TransactionInputType.HASH) {
            const repositoryFactory = this.profile.repositoryFactory;
            const transactionHttp = repositoryFactory.createTransactionRepository();
            const hash = await new HashResolver().resolve(options, 'Enter the hash of the aggregate bonded transaction to cosign: ');
            this.spinner.start();
            transactionHttp.getTransaction(hash, TransactionGroup.Partial).subscribe(
                async (transaction: Transaction) => {
                    this.spinner.stop();
                    console.log(FormatterService.title('Transaction to cosign:'));
                    new TransactionView(transaction, undefined, this.profile).print();
                    const cosignedTransaction = await this.getSignedAggregateBondedCosignature(transaction as AggregateTransaction, hash);
                    if (cosignedTransaction) {
                        this.announceAggregateBondedCosignature(cosignedTransaction);
                    }
                },
                (err) => {
                    this.spinner.stop();
                    console.log(FormatterService.error(err));
                },
            );
        } else {
            // tx payload selected
            const txPayload = await OptionsResolver(
                options,
                'payload',
                () => undefined,
                'Enter the transaction payload (hex string):',
                'text',
                undefined,
            );
            const transaction = TransactionMapping.createFromPayload(txPayload);
            console.log(FormatterService.success('Transaction to cosign:'));
            new TransactionView(transaction, undefined, this.profile).print();
            const cosignedTransaction = await this.getSignedAggregatePayloadCosignature(transaction as AggregateTransaction, txPayload);
            if (cosignedTransaction) {
                console.log('Co-signed transaction:' + JSON.stringify(cosignedTransaction));
            }
        }
    }

    /**
     * Attempts to cosign an aggregated transaction with transaction payload (off chain)
     * @private
     * @param transaction the transaction
     * @param {string} payload of the transaction to be cosigned
     * @returns {(CosignatureSignedTransaction | null)}
     */
    private async getSignedAggregatePayloadCosignature(
        transaction: Transaction,
        payload: string,
    ): Promise<CosignatureSignedTransaction | null> {
        const account = await this.profile.getSigningAccount(() => new PasswordResolver().resolve(this.options));
        try {
            const hash = Transaction.createTransactionHash(payload, Array.from(Convert.hexToUint8(this.profile.networkGenerationHash)));
            const signature = await account.cosignTransaction(transaction, hash);
            return new CosignatureSignedTransaction(hash, signature, account.publicKey);
        } catch (err: any) {
            this.spinner.stop();
            console.log(
                FormatterService.error(
                    `The profile ${this.profile.name} cannot cosign the transaction with payload ${payload}.  Error: ${
                        err.message || 'Unknown'
                    }`,
                ),
            );
            return null;
        } finally {
            await account.close();
        }
    }

    /**
     * Attempts to cosign an aggregated transaction cosignature
     * @private
     * @param {AggregateTransaction} transaction
     * @param {string} hash of the transaction to be cosigned
     * @returns {(CosignatureSignedTransaction | null)}
     */
    private async getSignedAggregateBondedCosignature(
        transaction: Transaction,
        hash: string,
    ): Promise<CosignatureSignedTransaction | null> {
        const account = await this.profile.getSigningAccount(() => new PasswordResolver().resolve(this.options));
        try {
            const signature = await account.cosignTransaction(transaction, hash);
            return new CosignatureSignedTransaction(hash, signature, account.publicKey);
        } catch (err: any) {
            console.log(
                FormatterService.error(
                    `The profile ${this.profile.name} cannot cosign the transaction with hash ${hash}. Error: ${err.message || 'Unknown'}`,
                ),
            );
            return null;
        } finally {
            await account.close();
        }
    }

    /**
     * Announces aggregate bonded cosignature
     * @private
     * @param {CosignatureSignedTransaction} signedCosignature
     * @returns {Promise<void>}
     */
    private async announceAggregateBondedCosignature(signedCosignature: CosignatureSignedTransaction): Promise<void> {
        try {
            this.spinner.start();
            await this.profile.repositoryFactory
                .createTransactionRepository()
                .announceAggregateBondedCosignature(signedCosignature)
                .toPromise();
            this.spinner.stop();
            console.log(FormatterService.success('Transaction cosigned and announced correctly'));
        } catch (err) {
            this.spinner.stop();
            console.log(FormatterService.error(err));
        }
    }
}
