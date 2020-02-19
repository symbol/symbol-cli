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
import {command, metadata, option} from 'clime'
import {BlockHttp, Order, QueryParams, Transaction} from 'nem2-sdk'
import {ProfileCommand, ProfileOptions} from '../../interfaces/profile.command'
import {HeightResolver} from '../../resolvers/height.resolver'
import {TransactionView} from '../../views/transactions/details/transaction.view'
import {HttpErrorHandler} from '../../services/httpErrorHandler.service'

export class CommandOptions extends ProfileOptions {
    @option({
        flag: 'h',
        description: 'Block height.',
    })
    height: string

    @option({
        flag: 's',
        description: '(Optional) Page size between 10 and 100. Default: 10',
    })
    pageSize: number

    @option({
        flag: 'i',
        description: '(Optional) Id after which we want objects to be returned.',
    })
    id: string

    @option({
        flag: 'o',
        description: '(Optional): Order of transactions. DESC. Newer to older. ASC. Older to newer. Default: DESC',
    })
    order: string
}

@command({
    description: 'Get transactions for a given block height',
})

export default class extends ProfileCommand {

    constructor() {
        super()
    }

    @metadata
    execute(options: CommandOptions) {

        this.spinner.start()

        const profile = this.getProfile(options)
        const queryParams = new QueryParams()
        const height = new HeightResolver().resolve(options)

        let pageSize = options.pageSize || 10
        if (pageSize < 10) {
            pageSize = 10
        } else if (pageSize > 100) {
            pageSize = 100
        }
        queryParams.setPageSize(pageSize)

        const id =  options.id || ''
        queryParams.setId(id)

        let order = options.order
        if (order !== 'ASC') {
            order = 'DESC'
        }
        queryParams.setOrder(order === 'ASC' ? Order.ASC : Order.DESC)


        const blockHttp = new BlockHttp(profile.url)
        blockHttp.getBlockTransactions(height, queryParams)
            .subscribe((transactions: any) => {
                this.spinner.stop(true)
                if (transactions.length > 0) {
                    transactions.forEach((transaction: Transaction, index: number) => {
                        console.log(`(${index + 1}) - `)
                        new TransactionView(transaction).print()
                    })
                } else {
                    console.log('[]')
                }
            }, (err) => {
                this.spinner.stop(true)
                console.log(HttpErrorHandler.handleError(err))
            })
    }
}
