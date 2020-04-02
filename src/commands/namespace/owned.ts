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
import {ProfileCommand} from '../../interfaces/profile.command'
import {ProfileOptions} from '../../interfaces/profile.options'
import {AddressResolver} from '../../resolvers/address.resolver'
import {HttpErrorHandler} from '../../services/httpErrorHandler.service'
import {NamespaceInfoTable} from './info'
import {NamespaceHttp} from 'symbol-sdk'
import {command, metadata, option} from 'clime'

export class CommandOptions extends ProfileOptions {

    @option({
        flag: 'a',
        description: 'Account address.',
    })
    address: string
}

@command({
    description: 'Get owned namespaces',
})

export default class extends ProfileCommand {

    constructor() {
        super()
    }

    @metadata
    async execute(options: CommandOptions) {
        const profile = this.getProfile(options)
        const address = await new AddressResolver().resolve(options, profile)

        this.spinner.start()
        const namespaceHttp = new NamespaceHttp(profile.url)
        namespaceHttp.getNamespacesFromAccount(address)
            .subscribe((namespaces) => {
                this.spinner.stop(true)

                if (namespaces.length === 0) {
                    console.log('The address ' + address.pretty() + ' does not own any namespaces.')
                }
                namespaces.map((namespace) => {
                    console.log(new NamespaceInfoTable(namespace).toString())
                })

            }, (err) => {
                this.spinner.stop(true)
                console.log(HttpErrorHandler.handleError(err))
            })
    }
}
