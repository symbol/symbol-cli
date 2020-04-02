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
import {BlockchainScore, ChainHttp} from 'symbol-sdk'

export class ChainScoreTable {
    private readonly table: HorizontalTable
    constructor(public readonly score: BlockchainScore) {
        this.table = new Table({
            style: {head: ['cyan']},
            head: ['Property', 'Value'],
        }) as HorizontalTable
        this.table.push(
            ['Score Low', score.scoreLow.toString()],
            ['Score High', score.scoreHigh.toString()],
        )
    }

    toString(): string {
        let text = ''
        text += '\n' + chalk.green('Storage Information') + '\n'
        text += this.table.toString()
        return text
    }
}

@command({
    description: 'Gets the current score of the chain',
})
export default class extends ProfileCommand {

    constructor() {
        super()
    }

    @metadata
    execute(options: ProfileOptions) {
        const profile = this.getProfile(options)

        this.spinner.start()
        const chainHttp = new ChainHttp(profile.url)
        chainHttp.getChainScore().subscribe((score) => {
            this.spinner.stop(true)
            console.log(new ChainScoreTable(score).toString())
        }, (err) => {
            this.spinner.stop(true)
            console.log(HttpErrorHandler.handleError(err))
        })
    }
}
