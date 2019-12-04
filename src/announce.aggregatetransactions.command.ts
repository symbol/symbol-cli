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
import {Address, Listener, SignedTransaction, TransactionHttp} from 'nem2-sdk';
import {merge} from 'rxjs';
import {filter, mergeMap} from 'rxjs/operators';
import {NumericStringValidator} from './validators/numericString.validator';
import {WalletCommand, WalletOptions} from './wallet.command';

export abstract class AnnounceAggregateTransactionsCommand extends WalletCommand {

    constructor() {
        super();
    }

    protected announceAggregateTransaction(signedHashLockTransaction: SignedTransaction,
                                           signedAggregateTransaction: SignedTransaction,
                                           senderAddress: Address,
                                           url: string) {
            const transactionHttp = new TransactionHttp(url);
            const listener = new Listener(url);
            listener.open().then(() => {
            merge(
                transactionHttp.announce(signedHashLockTransaction),
                listener
                    .confirmed(senderAddress)
                    .pipe(
                        filter((transaction) => transaction.transactionInfo !== undefined
                            && transaction.transactionInfo.hash === signedHashLockTransaction.hash),
                        mergeMap((ignored) => {
                            listener.terminate();
                            return transactionHttp.announceAggregateBonded(signedAggregateTransaction);
                        }))).subscribe((x) => console.log(chalk.green('Transaction confirmed:'), x.message),
                (err) => console.log(err));
        });
    }

}

export class AnnounceAggregateTransactionsOptions extends WalletOptions {
    @option({
        flag: 'f',
        description: 'Maximum fee you want to pay to announce the transaction.',
        validator: new NumericStringValidator(),
    })
    maxFee: string;

    @option({
        flag: 'F',
        description: 'Maximum fee you want to pay to announce the hash lock transaction.',
        validator: new NumericStringValidator(),
    })
    maxFeeHashLock: string;

    @option({
        flag: 'D',
        description: 'Hash lock duration expressed in blocks.',
        validator: new NumericStringValidator(),
        default: '480',
    })
    duration: string;

    @option({
        flag: 'L',
        description: 'Amounts of mosaics to lock.',
        validator: new NumericStringValidator(),
        default: '10',
    })
    amount: string;
}
