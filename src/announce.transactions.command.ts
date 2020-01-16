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
import * as Table from 'cli-table3';
import {HorizontalTable} from 'cli-table3';
import {option} from 'clime';
import {
    Address,
    Listener,
    ReceiptHttp,
    SignedTransaction,
    TransactionHttp,
    TransactionService,
    TransactionType,
} from 'nem2-sdk';
import {merge} from 'rxjs';
import {filter, mergeMap, tap} from 'rxjs/operators';
import { OptionsConfirmResolver } from './options-resolver';
import {ProfileCommand, ProfileOptions} from './profile.command';

export class AnnounceTransactionFieldsTable {
    private readonly table: HorizontalTable;

    constructor(public readonly signedTransaction: SignedTransaction, url: string) {
        this.table = new Table({
            style: {head: ['cyan']},
            head: ['Property', 'Value'],
        }) as HorizontalTable;

        const payload = AnnounceTransactionFieldsTable.formatPayload(signedTransaction.payload).join('\n');
        this.table.push(
            ['Payload', payload],
            ['Hash', signedTransaction.hash],
            ['Signer PublicKey', signedTransaction.signerPublicKey],
            ['Type', TransactionType[signedTransaction.type]],
            ['Network Type', signedTransaction.networkType],
            ['Url', url],
        );
    }

    /**
     * Formats a payload to fit in the command line.
     * @param {string} payload.
     * @returns {String[]}
     */
    static formatPayload(payload: string) {
        return payload.match(/.{1,64}/g) || [];
    }

    toString(title: string): string {
        let text = '';
        text += '\n' + chalk.green(title) + '\n';
        text += this.table.toString();
        return text;
    }
}

/**
 * Base command class to announce transactions.
 */
export abstract class AnnounceTransactionsCommand extends ProfileCommand {

    protected constructor() {
        super();
    }

    /**
     * Announces a transaction.
     * @param {SignedTransaction} signedTransaction
     * @param {string} url - Node URL.
     */
    protected async announceTransaction(signedTransaction: SignedTransaction, url: string) {
        console.log(new AnnounceTransactionFieldsTable(signedTransaction, url).toString('Transaction Information'));
        const shouldAnnounceTransaction = await OptionsConfirmResolver('Do you want to announce this transaction? ');
        if (shouldAnnounceTransaction) {
            this.spinner.start();
            const transactionHttp = new TransactionHttp(url);
            transactionHttp.announce(signedTransaction).subscribe(() => {
                this.spinner.stop(true);
                console.log(chalk.green('Transaction announced correctly'));
            }, (err) => {
                this.spinner.stop(true);
                console.log(chalk.red('Error'), err.message);
            });
        }
    }

    /**
     * Announces a transaction waiting for the response.
     * @param {SignedTransaction} signedTransaction
     * @param {Address} senderAddress - Address of the account sending the transaction.
     * @param {string} url - Node URL.
     */
    protected announceTransactionSync(signedTransaction: SignedTransaction, senderAddress: Address, url: string) {
        this.spinner.start();
        const transactionHttp = new TransactionHttp(url);
        const receiptHttp = new ReceiptHttp(url);
        const listener = new Listener(url);
        const transactionService = new TransactionService(transactionHttp, receiptHttp);
        listener.open().then(() => {
            merge(transactionService.announce(signedTransaction, listener),
                listener
                    .status(senderAddress)
                    .pipe(
                        filter((error) => error.hash === signedTransaction.hash),
                        tap((error) => {
                            throw new Error(error.code);
                        })))
                .subscribe((ignored) => {
                    listener.close();
                    this.spinner.stop(true);
                    console.log(chalk.green('\nTransaction confirmed.'));
                }, (err) => {
                    listener.close();
                    this.spinner.stop(true);
                    listener.close();
                    console.log(chalk.red('Error'), err.message);
                });
        }, (err) => {
            this.spinner.stop(true);
            listener.close();
            console.log(chalk.red('Error'), err.message);
        });
    }

    /**
     * Announces a hash lock transaction. Once this is confirmed, announces an aggregate transaction.
     * @param {SignedTransaction} signedHashLockTransaction
     * @param {SignedTransaction} signedAggregateTransaction
     * @param {Address} senderAddress - Address of the account sending the transaction.
     * @param {string} url - Node URL.
     */
    protected announceAggregateTransaction(signedHashLockTransaction: SignedTransaction,
                                           signedAggregateTransaction: SignedTransaction,
                                           senderAddress: Address,
                                           url: string) {
        this.spinner.start();
        let confirmations = 0;
        const transactionHttp = new TransactionHttp(url);
        const listener = new Listener(url);
        listener.open().then(() => {
            merge(
                transactionHttp.announce(signedHashLockTransaction),
                listener
                    .status(senderAddress)
                    .pipe(
                        filter((error) => error.hash === signedHashLockTransaction.hash),
                        tap((error) => {
                            throw new Error(error.code);
                        })),
                listener
                    .confirmed(senderAddress)
                    .pipe(
                        filter((transaction) => transaction.transactionInfo !== undefined
                            && transaction.transactionInfo.hash === signedHashLockTransaction.hash),
                        mergeMap((ignored) => {
                            return transactionHttp.announceAggregateBonded(signedAggregateTransaction);
                        }),
                    ),
            )
                .subscribe((ignored) => {
                    listener.close();
                    confirmations = confirmations + 1;
                    if (confirmations === 1) {
                        this.spinner.stop(true);
                        console.log(chalk.green('\n Hash lock transaction announced.'));
                        this.spinner.start();
                    } else if (confirmations === 2) {
                        listener.close();
                        this.spinner.stop(true);
                        console.log(chalk.green('\n Hash lock transaction confirmed.'));
                        console.log(chalk.green('\n Aggregate transaction announced.'));
                    }
                }, (err) => {
                    this.spinner.stop(true);
                    listener.close();
                    console.log(chalk.red('Error'), err.message);
                });
        }, (err) => {
            this.spinner.stop(true);
            listener.close();
            console.log(chalk.red('Error'), err.message);
        });
    }
}

/**
 * Announce transactions options
 */
export class AnnounceTransactionsOptions extends ProfileOptions {
    @option({
        flag: 'p',
        description: 'Profile password.',
    })
    password: string;

    @option({
        flag: 'f',
        description: 'Maximum fee (absolute amount).',
    })
    maxFee: string;

    @option({
        description: '(Optional) Wait until the server confirms or rejects the transaction.',
        toggle: true,
    })
    sync: any;

    @option({
        description: '(Optional) Announce the transaction without double confirmation.',
        toggle: true,
    })
    announce: any;

}

/**
 * Announce aggregate transactions options
 */
export class AnnounceAggregateTransactionsOptions extends AnnounceTransactionsOptions {

    @option({
        flag: 'F',
        description: 'Maximum fee (absolute amount) to announce the hash lock transaction.',
    })
    maxFeeHashLock: string;

    @option({
        flag: 'D',
        description: 'Hash lock duration expressed in blocks.',
        default: '480',
    })
    duration: string;

    @option({
        flag: 'L',
        description: 'Relative amount of network mosaic to lock.',
        default: '10',
    })
    amount: string;
}
