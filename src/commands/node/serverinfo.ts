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
import {HttpErrorHandler} from '../../services/httpErrorHandler.service'
import chalk from 'chalk'
import * as Table from 'cli-table3'
import {HorizontalTable} from 'cli-table3'
import {command, metadata} from 'clime'
import {NodeHttp, ServerInfo} from 'symbol-sdk'

export class ServerInfoTable {
    private readonly table: HorizontalTable
    constructor(public readonly serverInfo: ServerInfo) {
        this.table = new Table({
            style: {head: ['cyan']},
            head: ['Property', 'Value'],
        }) as HorizontalTable
        this.table.push(
            ['Rest Version', serverInfo.restVersion],
            ['SDK Version', serverInfo.sdkVersion],
        )
    }

    toString(): string {
        let text = ''
        text += '\n' + chalk.green('Server Information') + '\n'
        text += this.table.toString()
        return text
    }
}

@command({
    description: 'Get information about the REST instance',
})
export default class extends ProfileCommand {

    constructor() {
        super()
    }

    @metadata
    execute(options: ProfileOptions) {
        const profile = this.getProfile(options)

        this.spinner.start()
        const nodeHttp = new NodeHttp(profile.url)
        nodeHttp.getServerInfo()
            .subscribe((serverInfo) => {
                this.spinner.stop(true)
                console.log(new ServerInfoTable(serverInfo).toString())
            }, (err) => {
                this.spinner.stop(true)
                console.log(HttpErrorHandler.handleError(err))
            })
    }
}
