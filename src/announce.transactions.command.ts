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
import {Address, Listener, SignedTransaction, TransactionHttp, TransactionType} from 'nem2-sdk';
import * as readlineSync from 'readline-sync';
import {merge} from 'rxjs';
import {filter, mergeMap} from 'rxjs/operators';
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
    /**
     * Announces a transaction.
     * @param {SignedTransaction} signedTransaction
     * @param {string} url - Node URL.
     */
    protected async announceTransaction(signedTransaction: SignedTransaction, url: string) {
        console.log(new AnnounceTransactionFieldsTable(signedTransaction, url).toString('Transaction Information'));
        const shouldAnnounceTransaction = await OptionsConfirmResolver('Do you want to announce this transaction? ');
        if (shouldAnnounceTransaction) {
            const transactionHttp = new TransactionHttp(url);
            transactionHttp.announce(signedTransaction).subscribe(() => {
                console.log(chalk.green('Transaction announced correctly'));
            }, (err) => {
                let text = '';
                text += chalk.red('Error');
                err = err.message ? JSON.parse(err.message) : err;
                console.log(text, err.body && err.body.message ? err.body.message : err);
            });
        }
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
        const transactionHttp = new TransactionHttp(url);
        const listener = new Listener(url);
        console.log(new AnnounceTransactionFieldsTable(signedHashLockTransaction, url).toString('HashLock Transaction'));
        console.log(new AnnounceTransactionFieldsTable(signedAggregateTransaction, url).toString('Aggregate Transaction'));
        const shouldAnnounceTransaction = readlineSync.keyInYN('Do you want to announce these transactions? ');
        if (shouldAnnounceTransaction) {
            listener.open().then(() => {
                merge(
                    transactionHttp.announce(signedHashLockTransaction),
                    listener
                        .confirmed(senderAddress)
                        .pipe(
                            filter((transaction) => transaction.transactionInfo !== undefined
                                && transaction.transactionInfo.hash === signedHashLockTransaction.hash),
                            mergeMap((ignored) => {
                                listener.close();
                                return transactionHttp.announceAggregateBonded(signedAggregateTransaction);
                            }),
                        )).subscribe((x) => console.log(chalk.green('Transaction confirmed:'), x.message),
                    (err) => {
                        let text = '';
                        text += chalk.red('Error');
                        err = err.message ? JSON.parse(err.message) : err;
                        console.log(text, err.body && err.body.message ? err.body.message : err);
                    });
            });
        }
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
