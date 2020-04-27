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
import {ProfileCommand} from './profile.command'
import {ProfileOptions} from './profile.options'
import {option} from 'clime'
import {Order, QueryParams} from 'symbol-sdk'

/**
 * Base command class to retrieve transactions from an account.
 */
export abstract class AccountTransactionsCommand extends ProfileCommand {

    /**
     * Constructor.
     */
    protected constructor() {
        super()
    }
}

/**
 * Account transactions options
 */
export class AccountTransactionsOptions extends ProfileOptions {
    @option({
        flag: 'a',
        description: 'Account address.',
    })
    address: string

    @option({
        flag: 'n',
        description: '(Optional) Number of transactions per page.',
        default: 10,
    })
    pageSize: number

    @option({
        flag: 'i',
        description: '(Optional) Identifier of the transaction after which we want the transactions to be returned.',
    })
    id: string

    @option({
        flag: 'o',
        description: '(Optional): Order of transactions. DESC. Newer to older. ASC. Older to newer.',
        default: 'DESC',
    })
    order: string

    /**
     * Creates QueryParams object based on options.
     * @returns {QueryParams}
     */
    getQueryParams(): QueryParams {
        const queryParams = new QueryParams({
            pageSize: this.pageSize,
            id: this.id,
            order: this.order === 'ASC' ? Order.ASC : Order.DESC})
        return queryParams
    }
}
