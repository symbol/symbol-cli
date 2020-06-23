import { Profile } from '../models/profile.model';
import { Account, AggregateTransaction, Deadline, HashLockTransaction, MultisigAccountInfo, NetworkType, PublicAccount, SignedTransaction, Transaction, UInt64 } from 'symbol-sdk';

import { AnnounceTransactionsOptions } from '../interfaces/announceTransactions.options';
import { MultisigAccount } from '../models/multisig.types';
import { NetworkCurrency } from '../models/networkCurrency.model';
import { MaxFeeResolver } from '../resolvers/maxFee.resolver';
import { TransactionView } from '../views/transactions/details/transaction.view';

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

export enum AnnounceMode {
    'standard' = 'standard',
    'partial' = 'partial',
    'complete' = 'complete',
}

export interface TransactionSignatureOptions {
    /**
     * The account that will sign the transactions
     * @type {Account}
     */
    account: Account;
    /**
     * The transactions to sign
     * @type {Transaction[]}
     */
    transactions: Transaction[];
    /**
     * The max fee of the transactions to sign
     * @type {UInt64}
     */
    maxFee: UInt64;
    /**
     * The public key of the signer
     * (if sending a multisig transaction)
     * @type {string}
     */
    signerMultisig?: MultisigAccount | null;

    /**
     * Whether to force wrapping transactions in an aggregate
     * (eg: Mosaic creation transaction)
     * @type {boolean}
     */
    isAggregate?: boolean;

    /**
     * Whether to force announcing a transaction in an hash lock
     * @type {boolean}
     */
    isAggregateBonded?: boolean;
}

export class TransactionSignatureService {
    maxFee: UInt64;
    txToSign: Transaction[];
    signerPublicAccount?: PublicAccount;
    signedLockTransaction: SignedTransaction;
    signerMultisig?: MultisigAccount | null;
    isAggregate? = false;
    isAggregateBonded? = false;

    get generationHash(): string {
        return this.profile.networkGenerationHash;
    }
    get networkType(): NetworkType {
        return this.profile.address.networkType;
    }
    get networkCurrency(): NetworkCurrency {
        return this.profile.networkCurrency;
    }
    get url(): string {
        return this.profile.url;
    }

    get announceMode(): AnnounceMode {
        if (this.isAggregate) {
            if (this.signerMultisig && this.signerMultisig.info.minApproval > 1) {
                return AnnounceMode.partial;
            }
        }
        if (this.isAggregateBonded) {
            return AnnounceMode.partial;
        }
        if (!this.signerMultisig) {
            return AnnounceMode.standard;
        }
        return AnnounceMode.complete;
    }

    public static create(profile: Profile, options: AnnounceTransactionsOptions): TransactionSignatureService {
        return new TransactionSignatureService(profile, options);
    }

    private constructor(private readonly profile: Profile, private readonly options: AnnounceTransactionsOptions) {}

    public async signTransactions(args: TransactionSignatureOptions): Promise<SignedTransaction[]> {
        const { account, transactions, signerMultisig, maxFee, isAggregate, isAggregateBonded } = args;

        // set class variables
        this.maxFee = maxFee;
        this.txToSign = transactions;
        this.signerMultisig = signerMultisig;
        this.isAggregate = isAggregate;
        this.isAggregateBonded = isAggregateBonded;
        if (signerMultisig) {
            this.signerPublicAccount = signerMultisig.publicAccount;
        }

        // return signed transactions
        if (this.announceMode === AnnounceMode.complete) {
            return this.signCompleteTransactions(account);
        }

        if (this.announceMode === AnnounceMode.partial) {
            return this.signPartialTransactions(account);
        }

        return transactions.map((tx) => {
            // sign transaction
            const signedTransaction = this.signTransaction(tx, account);

            // print transactions
            new TransactionView(tx, signedTransaction).print();

            return signedTransaction;
        });
    }

    private async signPartialTransactions(account: Account): Promise<SignedTransaction[]> {
        // create an aggregate bonded transaction
        const signerPublicAccount = this.signerPublicAccount || account.publicAccount;
        const aggregateTx = AggregateTransaction.createBonded(
            Deadline.create(),
            this.txToSign.map((t) => t.toAggregate(signerPublicAccount)),
            this.networkType,
            [],
            this.maxFee,
        );

        // sign aggregate transaction
        const signedAggregate = account.sign(aggregateTx, this.generationHash);

        // create and sign lock transaction
        const hashLock = await this.createHashLockTransaction(signedAggregate);
        const signedLock = this.signTransaction(hashLock, account);

        // print the transactions
        new TransactionView(aggregateTx, signedAggregate).print();
        new TransactionView(hashLock, signedLock).print();

        return [signedLock, signedAggregate];
    }

    private signCompleteTransactions(account: Account): SignedTransaction[] {
        // create an aggreate complete transaction
        const signerPublicAccount = this.signerPublicAccount || account.publicAccount;
        const aggregateTransaction = AggregateTransaction.createComplete(
            Deadline.create(),
            this.txToSign.map((t) => t.toAggregate(signerPublicAccount)),
            this.networkType,
            [],
            this.maxFee,
        );

        // sign
        const signedTransaction = this.signTransaction(aggregateTransaction, account);

        // print
        new TransactionView(aggregateTransaction, signedTransaction).print();

        return [signedTransaction];
    }

    private signTransaction(transaction: Transaction, account: Account): SignedTransaction {
        return account.sign(transaction, this.generationHash);
    }

    private async createHashLockTransaction(aggregateTx: SignedTransaction): Promise<HashLockTransaction> {
        const maxFeeHashLock = await new MaxFeeResolver().resolve(
            this.options,
            'Enter the maximum fee to announce the hashlock transaction (absolute amount):',
            'maxFeeHashLock',
        );

        return HashLockTransaction.create(
            Deadline.create(),
            this.networkCurrency.createRelative(this.options.lockAmount),
            UInt64.fromNumericString(this.options.lockDuration),
            aggregateTx,
            this.networkType,
            maxFeeHashLock,
        );
    }
}
