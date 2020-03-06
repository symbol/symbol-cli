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
import {HeightResolver} from '../../resolvers/height.resolver'
import {TransactionView} from '../../views/transactions/details/transaction.view'
import {HttpErrorHandler} from '../../services/httpErrorHandler.service'
import {AccountTransactionsCommand, AccountTransactionsOptions} from '../../interfaces/account.transactions.command'
import {BlockHttp} from 'symbol-sdk'
import {command, metadata, option} from 'clime'

export class CommandOptions extends AccountTransactionsOptions {
    @option({
        flag: 'h',
        description: 'Block height.',
    })
    height: string
}

@command({
    description: 'Get transactions for a given block height',
})

export default class extends AccountTransactionsCommand {

    constructor() {
        super()
    }

    @metadata
    async execute(options: CommandOptions) {

        const profile = this.getProfile(options)
        const height = await new HeightResolver().resolve(options)

        this.spinner.start()
        const blockHttp = new BlockHttp(profile.url)
        blockHttp.getBlockTransactions(height, options.getQueryParams())
            .subscribe((transactions) => {
                this.spinner.stop(true)

                if (!transactions.length) {
                    console.log('There aren\'t transactions')
                }

                transactions.forEach((transaction) => {
                    new TransactionView(transaction).print()
                })
            }, (err) => {
                this.spinner.stop(true)
                console.log(HttpErrorHandler.handleError(err))
            })
    }
}
