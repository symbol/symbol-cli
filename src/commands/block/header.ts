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
import {HeightResolver} from '../../resolvers/height.resolver'
import {HttpErrorHandler} from '../../services/httpErrorHandler.service'
import chalk from 'chalk'
import * as Table from 'cli-table3'
import {HorizontalTable} from 'cli-table3'
import {command, metadata, option} from 'clime'
import {BlockHttp, BlockInfo, NetworkType} from 'symbol-sdk'

export class CommandOptions extends ProfileOptions {
    @option({
        flag: 'h',
        description: 'Block height.',
    })
    height: string
}

export class BlockHeaderTable {
    private readonly table: HorizontalTable
    constructor(public readonly blockInfo: BlockInfo) {
        this.table = new Table({
            style: {head: ['cyan']},
            head: ['Property', 'Value'],
        }) as HorizontalTable
        this.table.push(
            ['Generation Hash:', blockInfo.generationHash],
            ['Total Fee:', blockInfo.totalFee.toString()],
            ['Number of Transactions:', blockInfo.numTransactions],
            ['Signature:', blockInfo.signature.slice(0, 64) + '\n' + blockInfo.signature.slice(64, 128)],
            ['Signer:', blockInfo.signer.publicKey],
            ['Network Type:', NetworkType[blockInfo.networkType]],
            ['Version:', blockInfo.version],
            ['Type:', blockInfo.type],
            ['Height:', blockInfo.height.toString()],
            ['Timestamp:', blockInfo.timestamp.toString()],
            ['Difficulty:', blockInfo.difficulty.toString()],
            ['Fee Multiplier:', blockInfo.feeMultiplier],
            ['Previous Block Hash:', blockInfo.previousBlockHash],
            ['Block Transactions Hash:', blockInfo.blockTransactionsHash],
            ['Block Receipts Hash:', blockInfo.blockReceiptsHash],
            ['State Hash:', blockInfo.stateHash],
        )
        if (blockInfo.beneficiaryPublicKey) {
            this.table.push(
                ['Beneficiary Public Key', blockInfo.beneficiaryPublicKey.publicKey],
            )
        }
    }

    toString(): string {
        let text = ''
        text += '\n' + chalk.green('Block Header') + '\n'
        text += this.table.toString()
        return text
    }
}

@command({
    description: 'Get block header by height',
})
export default class extends ProfileCommand {

    constructor() {
        super()
    }

    @metadata
    async execute(options: CommandOptions) {
        const profile = this.getProfile(options)
        const height = await new HeightResolver().resolve(options)

        this.spinner.start()
        const blockHttp = new BlockHttp(profile.url)
        blockHttp.getBlockByHeight(height)
            .subscribe((blockInfo) => {
                this.spinner.stop(true)
                console.log(new BlockHeaderTable(blockInfo).toString())
            }, (err) => {
                this.spinner.stop(true)
                console.log(HttpErrorHandler.handleError(err))
            })
    }
}
