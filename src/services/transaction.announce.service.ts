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
import chalk from 'chalk';
import ora from 'ora';
import { merge } from 'rxjs';
import { filter, mergeMap, tap } from 'rxjs/operators';
import {
    Listener,
    NamespaceHttp,
    SignedTransaction,
    Transaction,
    TransactionAnnounceResponse,
    TransactionHttp,
    TransactionType,
} from 'symbol-sdk';

import { AnnounceTransactionsOptions } from '../interfaces/announceTransactions.options';
import { Profile } from '../models/profile.model';
import { AnnounceResolver } from '../resolvers/announce.resolver';
import { HttpErrorHandler } from '../services/httpErrorHandler.service';

export class TransactionAnnounceService {
    public spinner: any;

    /**
     * Creates an instance of TransactionAnnounceService.
     * @static
     * @param {Profile} profile
     * @param {AnnounceTransactionsOptions} options
     * @returns {TransactionAnnounceService}
     */
    public static create(profile: Profile, options: AnnounceTransactionsOptions): TransactionAnnounceService {
        return new TransactionAnnounceService(profile, options);
    }

    /**
     * Creates an instance of TransactionAnnounceService.
     * @param {Profile} profile
     * @param {AnnounceTransactionsOptions} options
     */
    private constructor(private readonly profile: Profile, private readonly options: AnnounceTransactionsOptions) {
        this.spinner = ora('Processing');
    }

    /**
     * Returns endpoint used to announce transactions.
     * @readonly
     * @type {string}
     */
    public get url(): string {
        return this.profile.url;
    }

    /**
     * Announce any transactions.
     * Takes no more than 1 aggregate bounded with its hash lock.
     * @param {SignedTransaction[]} transactions
     * @returns {Promise<void>}
     */
    public async announce(transactions: SignedTransaction[]): Promise<void> {
        // does the user wants to announce?
        if (!(await new AnnounceResolver().resolve(this.options))) {
            return;
        }

        // split transactions by announce mode
        const aggregateTxTypes = [TransactionType.AGGREGATE_BONDED, TransactionType.HASH_LOCK];
        const normalTx = transactions.filter(({ type }) => !aggregateTxTypes.includes(type));
        const hashLockTx = transactions.filter(({ type }) => aggregateTxTypes.includes(type));

        if (normalTx.length) {
            this.announceTransactions(normalTx);
        }
        if (hashLockTx.length) {
            this.announceAggregateTransaction(hashLockTx);
        }
    }

    /**
     * Announces transactions that are not aggregate bounded.
     * @private
     * @param {SignedTransaction[]} transactions
     */
    private announceTransactions(transactions: SignedTransaction[]) {
        if (this.options.sync) {
            for (const tx of transactions) {
                this.announceTransactionSync(tx);
            }
            return;
        }

        for (const tx of transactions) {
            this.announceTransaction(tx);
        }
    }

    /**
     * Announces a transaction.
     * @param {SignedTransaction} signedTransaction
     */
    private announceTransaction(signedTransaction: SignedTransaction): void {
        const transactionHttp = new TransactionHttp(this.url);
        transactionHttp.announce(signedTransaction).subscribe(
            (ignored) => {
                this.spinner.stop();
                console.log(chalk.green('\nTransaction announced correctly.'));
                console.log(
                    chalk.blue('Info'),
                    'To check if the network confirms or rejects the transaction, ' + "run the command 'symbol-cli transaction status'.",
                );
            },
            (err) => {
                this.spinner.stop();
                console.log(HttpErrorHandler.handleError(err));
            },
        );
    }

    /**
     * Announces a transaction waiting for the response.
     * @param {SignedTransaction} Signed transaction.
     */
    public announceTransactionSync(signedTransaction: SignedTransaction) {
        this.spinner.start();
        const transactionHttp = new TransactionHttp(this.url);
        const namespaceHttp = new NamespaceHttp(this.url);
        const listener = new Listener(this.url, namespaceHttp);
        const senderAddress = signedTransaction.getSignerAddress();

        listener.open().then(
            () => {
                merge(
                    transactionHttp.announce(signedTransaction),
                    listener
                        .confirmed(senderAddress)
                        .pipe(
                            filter(
                                (transaction) =>
                                    transaction.transactionInfo !== undefined &&
                                    transaction.transactionInfo.hash === signedTransaction.hash,
                            ),
                        ),
                    listener.status(senderAddress).pipe(
                        filter((error) => error.hash === signedTransaction.hash),
                        tap((error) => {
                            throw new Error(error.code);
                        }),
                    ),
                ).subscribe(
                    (response) => {
                        if (response instanceof TransactionAnnounceResponse) {
                            this.spinner.stop();
                            console.log(chalk.green('\nTransaction announced.'));
                            this.spinner.start();
                        } else if (response instanceof Transaction) {
                            listener.close();
                            this.spinner.stop();
                            console.log(chalk.green('\nTransaction confirmed.'));
                        }
                    },
                    (err) => {
                        listener.close();
                        this.spinner.stop();
                        console.log(HttpErrorHandler.handleError(err));
                    },
                );
            },
            (err) => {
                listener.close();
                this.spinner.stop();
                console.log(chalk.red('Error'), err.message);
            },
        );
    }

    /**
     * Announces a hash lock transaction. Once this is confirmed, announces an aggregate transaction.
     * @param {SignedTransaction[]} transactions
     */
    public announceAggregateTransaction(transactions: SignedTransaction[]): void {
        this.spinner.start();

        if (transactions.length !== 2) {
            throw new Error('announceAggregateTransaction must be provided with 2 transactions');
        }

        const hashLock = transactions.find(({ type }) => type === TransactionType.HASH_LOCK);
        const aggregate = transactions.find(({ type }) => type === TransactionType.AGGREGATE_BONDED);

        if (!hashLock || !aggregate) {
            throw new Error('announceAggregateTransaction must be provided with an haslock and an aggregate bonded');
        }

        let confirmations = 0;
        const transactionHttp = new TransactionHttp(this.url);
        const namespaceHttp = new NamespaceHttp(this.url);
        const listener = new Listener(this.url, namespaceHttp);
        const senderAddress = hashLock.getSignerAddress();

        listener.open().then(
            () => {
                merge(
                    transactionHttp.announce(hashLock),
                    listener.status(senderAddress).pipe(
                        filter((error) => error.hash === hashLock.hash),
                        tap((error) => {
                            throw new Error(error.code);
                        }),
                    ),
                    listener.confirmed(senderAddress).pipe(
                        filter(
                            (transaction) =>
                                transaction.transactionInfo !== undefined && transaction.transactionInfo.hash === hashLock.hash,
                        ),
                        mergeMap((ignored) => transactionHttp.announceAggregateBonded(aggregate)),
                    ),
                ).subscribe(
                    (ignored) => {
                        confirmations = confirmations + 1;
                        if (confirmations === 1) {
                            this.spinner.stop();
                            console.log(chalk.green('\n Hash lock transaction announced.'));
                            this.spinner.start();
                        } else if (confirmations === 2) {
                            listener.close();
                            this.spinner.stop();
                            console.log(chalk.green('\n Hash lock transaction confirmed.'));
                            console.log(chalk.green('\n Aggregate transaction announced.'));
                        }
                    },
                    (err) => {
                        listener.close();
                        this.spinner.stop();
                        console.log(HttpErrorHandler.handleError(err));
                    },
                );
            },
            (err) => {
                listener.close();
                this.spinner.stop();
                console.log(HttpErrorHandler.handleError(err));
            },
        );
    }
}
