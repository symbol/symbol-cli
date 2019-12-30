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
import {option} from 'clime';
import {SignedTransaction, TransactionHttp} from 'nem2-sdk';
import * as readlineSync from 'readline-sync';
import {ProfileCommand, ProfileOptions} from './profile.command';
import {NumericStringValidator} from './validators/numericString.validator';
import {PasswordValidator} from './validators/password.validator';

/**
 * Base command class to announce transactions.
 */
export abstract class AnnounceTransactionsCommand extends ProfileCommand {

    /**
     * Formats a payload to fit in the command line.
     * @param {string} payload.
     * @returns {String[]}
     */
     static formatPayload(payload: string) {
        return payload.match(/.{1,64}/g) || [];
    }

    /**
     * Announces a transaction.
     * @param {SignedTransaction} signedTransaction
     * @param {string} url - Node URL.
     */
    protected announceTransaction(signedTransaction: SignedTransaction, url: string) {
        const payload = AnnounceTransactionsCommand.formatPayload(signedTransaction.payload).join('\n');
        const shouldAnnounceTransaction = readlineSync.keyInYN('Do you want to announce this transaction? ' +
             'Payload:\n' + payload);
        if (shouldAnnounceTransaction) {
            const transactionHttp = new TransactionHttp(url);
            transactionHttp.announce(signedTransaction).subscribe(() => {
                console.log(chalk.green('Transaction announced correctly'));
                console.log(chalk.green('Hash:   '), signedTransaction.hash);
                console.log(chalk.green('SignerPublicKey: '), signedTransaction.signerPublicKey);
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
