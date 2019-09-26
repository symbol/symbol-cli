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
import {ProfileCommand, ProfileOptions} from './profile.command';
import {MaxFeeValidator} from './validators/maxFee.validator';

export abstract class AnnounceTransactionsCommand extends ProfileCommand {

    constructor() {
        super();
    }

     protected announceTransaction(signedTransaction: SignedTransaction, url: string) {
        const transactionHttp = new TransactionHttp(url);

        transactionHttp.announce(signedTransaction).subscribe(() => {
            console.log(chalk.green('Transaction announced correctly'));
            console.log('Hash:   ', signedTransaction.hash);
            console.log('SignerPublicKey: ', signedTransaction.signerPublicKey);
        }, (err) => {
            this.spinner.stop(true);
            let text = '';
            text += chalk.red('Error');
            console.log(text, err.response !== undefined ? err.response.text : err);
        });

    }
}

export class AnnounceTransactionsOptions extends ProfileOptions {
    @option({
        flag: 'f',
        description: 'Maximum fee you want to pay to announce this transaction. Default: 0',
        validator: new MaxFeeValidator(),
    })
    maxFee: number;
}
