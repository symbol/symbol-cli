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
import {MonitorAddressCommand, MonitorAddressOptions} from '../../interfaces/monitor.transaction.command'
import {AddressResolver} from '../../resolvers/address.resolver'
import {TransactionView} from '../../views/transactions/details/transaction.view'
import {HttpErrorHandler} from '../../services/httpErrorHandler.service'
import chalk from 'chalk'
import {command, metadata} from 'clime'
import {AggregateTransaction, BlockInfo, Listener, Transaction, TransactionStatusError} from 'symbol-sdk'
import {merge} from 'rxjs'

@command({
    description: 'Monitors new blocks, confirmed, aggregate bonded added, and status errors related to an account.',
})
export default class extends MonitorAddressCommand {

    constructor() {
        super()
    }

    @metadata
    async execute(options: MonitorAddressOptions) {
        const profile = this.getProfile(options)
        const address = await new AddressResolver().resolve(options, profile)

        console.log(chalk.green('Monitoring ') + `${address.pretty()} using ${profile.url}`)
        const listener = new Listener(profile.url)
        listener.open().then(() => {
            merge(
                listener.newBlock(),
                listener.confirmed(address),
                listener.aggregateBondedAdded(address),
                listener.status(address))
                .subscribe((response) => {
                    if (response instanceof AggregateTransaction &&
                        response.transactionInfo &&
                        response.transactionInfo.height.compact() === 0) {
                        console.log(chalk.green('\nNew aggregate bonded transaction added:'))
                        new TransactionView(response).print()
                    } else if (response instanceof Transaction) {
                        console.log(chalk.green('\nNew transaction confirmed:'))
                        new TransactionView(response).print()
                    } else if (response instanceof BlockInfo) {
                        console.log(chalk.green('\nNew block:'), response.height.toString())
                    } else if (response instanceof TransactionStatusError) {
                        console.log(chalk.green('\nTransaction error:'), response.hash)
                        console.log('\n' + response.code)
                    }
                }, (err) => {
                    console.log(HttpErrorHandler.handleError(err))
                    listener.close()
                })
        }, (err) => {
            this.spinner.stop(true)
            console.log(HttpErrorHandler.handleError(err))
        })
    }
}
