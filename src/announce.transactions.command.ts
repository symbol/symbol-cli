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
import { HorizontalTable } from 'cli-table3';
import * as Table from 'cli-table3';
import { option } from 'clime';
import { SignedTransaction, TransactionHttp, TransactionType } from 'nem2-sdk';
import * as readlineSync from 'readline-sync';
import { ProfileCommand, ProfileOptions } from './profile.command';
import { NumericStringValidator } from './validators/numericString.validator';
import { PasswordValidator } from './validators/password.validator';

export class AnnounceTransactionFieldsTable {
    private readonly table: HorizontalTable;

    /**
     * Formats a payload to fit in the command line.
     * @param {string} payload.
     * @returns {String[]}
     */
    static formatPayload(payload: string) {
        return payload.match(/.{1,64}/g) || [];
    }

    constructor(public readonly signedTransaction: SignedTransaction, url: string) {
        this.table = new Table({
            style: { head: ['cyan'] },
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
    protected announceTransaction(signedTransaction: SignedTransaction, url: string) {
        console.log(new AnnounceTransactionFieldsTable(signedTransaction, url).toString('Transaction Information'));
        const shouldAnnounceTransaction = readlineSync.keyInYN('Do you want to announce this transaction? ');
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
}

/**
 * Announce transactions options
 */
export class AnnounceTransactionsOptions extends ProfileOptions {
    @option({
        flag: 'p',
        description: '(Optional) Profile password',
        validator: new PasswordValidator(),
    })
    password: string;

    @option({
        flag: 'f',
        description: 'Maximum fee (absolute amount).',
        validator: new NumericStringValidator(),
    })
    maxFee: string;
}
