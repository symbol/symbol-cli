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
import chalk from 'chalk'
import {command, metadata, option} from 'clime'
import {TransactionHttp} from 'nem2-sdk'
import {ProfileCommand, ProfileOptions} from '../../interfaces/profile.command'
import {HashResolver} from '../../resolvers/hash.resolver'
import {TransactionView} from '../../views/transactions/details/transaction.view'
import { NodeErrorService } from '../../services/nodeError.service'

export class CommandOptions extends ProfileOptions {
    @option({
        flag: 'h',
        description: 'Transaction hash.',
    })
    hash: string
}

@command({
    description: 'Fetch transaction info',
})
export default class extends ProfileCommand {

    constructor() {
        super()
    }

    @metadata
    execute(options: CommandOptions) {
        this.spinner.start()
        const profile = this.getProfile(options)
        const hash = new HashResolver()
            .resolve(options)

        const transactionHttp = new TransactionHttp(profile.url)
        transactionHttp.getTransaction(hash)
            .subscribe((transaction) => {
                this.spinner.stop(true)
                new TransactionView(transaction).print()
            }, (err) => {
                NodeErrorService.connectErrorHandler(err, () => {
                    this.spinner.stop(true)
                })
            })
    }
}
