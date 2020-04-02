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
import {HttpErrorHandler} from '../services/httpErrorHandler.service'
import {ProfileCommand} from './profile.command'
import {ProfileOptions} from './profile.options'
import chalk from 'chalk'
import {Address, Listener, SignedTransaction, Transaction, TransactionAnnounceResponse, TransactionHttp } from 'symbol-sdk'
import {merge} from 'rxjs'
import {filter, mergeMap, tap} from 'rxjs/operators'

/**
 * Base command class to announce transactions.
 */
export abstract class AnnounceTransactionsCommand extends ProfileCommand {

    protected constructor() {
        super()
    }

    /**
     * Announces a transaction.
     * @param {SignedTransaction} signedTransaction
     * @param {string} url - Node URL.
     */
    protected announceTransaction(signedTransaction: SignedTransaction, url: string) {
        this.spinner.start()
        const transactionHttp = new TransactionHttp(url)
        transactionHttp
            .announce(signedTransaction)
            .subscribe((ignored) => {
                this.spinner.stop(true)
                console.log(chalk.green('\nTransaction announced correctly.'))
                console.log(chalk.blue('Info'), 'To check if the network confirms or rejects the transaction, ' +
                    'run the command \'symbol-cli transaction status\'.')

            }, (err) => {
                this.spinner.stop(true)
                console.log(HttpErrorHandler.handleError(err))
            })
    }

    /**
     * Announces a transaction waiting for the response.
     * @param {SignedTransaction} Signed transaction.
     * @param {Address} senderAddress - Address of the account sending the transaction.
     * @param {string} url - Node URL.
     */
    protected announceTransactionSync(signedTransaction: SignedTransaction, senderAddress: Address, url: string) {
        this.spinner.start()
        const transactionHttp = new TransactionHttp(url)
        const listener = new Listener(url)
        listener.open().then(() => {
            merge(
                transactionHttp.announce(signedTransaction),
                listener
                    .confirmed(senderAddress)
                    .pipe(
                        filter((transaction) => transaction.transactionInfo !== undefined
                            && transaction.transactionInfo.hash === signedTransaction.hash),
                    ),
                listener
                    .status(senderAddress)
                    .pipe(
                        filter((error) => error.hash === signedTransaction.hash),
                        tap((error) => {
                            throw new Error(error.code)
                        })))
                .subscribe((response) => {
                    if (response instanceof TransactionAnnounceResponse) {
                        this.spinner.stop(true)
                        console.log(chalk.green('\nTransaction announced.'))
                        this.spinner.start()
                    }
                    else if (response instanceof Transaction){
                        listener.close()
                        this.spinner.stop(true)
                        console.log(chalk.green('\nTransaction confirmed.'))
                    }
                }, (err) => {
                    listener.close()
                    this.spinner.stop(true)
                    console.log(HttpErrorHandler.handleError(err))
                })
        }, (err) => {
            listener.close()
            this.spinner.stop(true)
            console.log(chalk.red('Error'), err.message)
        })
    }

    /**
     * Announces a hash lock transaction. Once this is confirmed, announces an aggregate transaction.
     * @param {signedHashLockTransaction} Signed hash lock transaction.
     * @param {signedAggregateTransaction} Signed aggregate transaction.
     * @param {Address} senderAddress - Address of the account sending the transaction.
     * @param {string} url - Node URL.
     */
    protected announceAggregateTransaction(signedHashLockTransaction: SignedTransaction,
                                           signedAggregateTransaction: SignedTransaction,
                                           senderAddress: Address,
                                           url: string) {
        this.spinner.start()
        let confirmations = 0
        const transactionHttp = new TransactionHttp(url)
        const listener = new Listener(url)
        listener.open().then(() => {
            merge(
                transactionHttp.announce(signedHashLockTransaction),
                listener
                    .status(senderAddress)
                    .pipe(
                        filter((error) => error.hash === signedHashLockTransaction.hash),
                        tap((error) => {
                            throw new Error(error.code)
                        })),
                listener
                    .confirmed(senderAddress)
                    .pipe(
                        filter((transaction) => transaction.transactionInfo !== undefined
                            && transaction.transactionInfo.hash === signedHashLockTransaction.hash),
                        mergeMap((ignored) => transactionHttp.announceAggregateBonded(signedAggregateTransaction)),
                    ),
            )
                .subscribe((ignored) => {
                    confirmations = confirmations + 1
                    if (confirmations === 1) {
                        this.spinner.stop(true)
                        console.log(chalk.green('\n Hash lock transaction announced.'))
                        this.spinner.start()
                    } else if (confirmations === 2) {
                        listener.close()
                        this.spinner.stop(true)
                        console.log(chalk.green('\n Hash lock transaction confirmed.'))
                        console.log(chalk.green('\n Aggregate transaction announced.'))
                    }
                }, (err) => {
                    listener.close()
                    this.spinner.stop(true)
                    console.log(HttpErrorHandler.handleError(err))
                })
        }, (err) => {
            listener.close()
            this.spinner.stop(true)
            console.log(HttpErrorHandler.handleError(err))
        })
    }
}
