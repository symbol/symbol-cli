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
import chalk from 'chalk';
import {command, metadata, option} from 'clime';
import {
    AggregateTransaction,
    Deadline,
    MosaicDefinitionTransaction,
    MosaicFlags,
    MosaicId,
    MosaicNonce,
    MosaicSupplyChangeAction,
    MosaicSupplyChangeTransaction,
    UInt64,
} from 'nem2-sdk';
import * as readlineSync from 'readline-sync';
import {AnnounceTransactionsCommand, AnnounceTransactionsOptions} from '../../announce.transactions.command';
import {AmountResolver} from '../../resolvers/amount.resolver';
import {DivisibilityResolver} from '../../resolvers/divisibility.resolver';
import {DurationResolver} from '../../resolvers/duration.resolver';
import {MaxFeeResolver} from '../../resolvers/maxFee.resolver';
import {NumericStringValidator} from '../../validators/numericString.validator';

export class CommandOptions extends AnnounceTransactionsOptions {
    @option({
        flag: 'a',
        description: 'Initial supply of mosaics.',
        validator: new NumericStringValidator(),
    })
    amount: string;

    @option({
        flag: 't',
        description: '(Optional) Mosaic transferable.',
        toggle: true,
    })
    transferable: any;

    @option({
        flag: 's',
        description: '(Optional) Mosaic supply mutable.',
        toggle: true,
    })
    supplyMutable: any;

    @option({
        flag: 'r',
        description: '(Optional) Mosaic restrictable.',
        toggle: true,
    })
    restrictable: any;

    @option({
        flag: 'd',
        description: 'Mosaic divisibility, from 0 to 6.',
    })
    divisibility: number;

    @option({
        flag: 'u',
        description: 'Mosaic duration in amount of blocks.',
        validator: new NumericStringValidator(),
    })
    duration: string;

    @option({
        flag: 'n',
        description: '(Optional) Mosaic non-expiring.',
        toggle: true,
    })
    nonExpiring: any;
}

@command({
    description: 'Create a new mosaic',
})

export default class extends AnnounceTransactionsCommand {

    constructor() {
        super();
    }

    @metadata
    async execute(options: CommandOptions) {
        const profile = this.getProfile(options);
        const account = await profile.decrypt(options);

        const nonce = MosaicNonce.createRandom();
        let blocksDuration;
        if (!options.nonExpiring) {
            if (!readlineSync.keyInYN('Do you want a non-expiring mosaic?')) {
                blocksDuration = await new DurationResolver().resolve(options);
            }
        }
        const divisibility = await new DivisibilityResolver().resolve(options);
        const mosaicFlags = MosaicFlags.create(
            options.supplyMutable ? options.supplyMutable : readlineSync.keyInYN(
                'Do you want mosaic to have supply mutable?'),
            options.transferable ? options.transferable : readlineSync.keyInYN(
                'Do you want mosaic to be transferable?'),
            options.restrictable ? options.restrictable : readlineSync.keyInYN(
                'Do you want mosaic to be restrictable?'),
        );
        const amount = await new AmountResolver().resolve(options, undefined, 'Amount of mosaics units to create: ');
        const maxFee = await new MaxFeeResolver().resolve(options);

        const mosaicDefinitionTransaction = MosaicDefinitionTransaction.create(
            Deadline.create(),
            nonce,
            MosaicId.createFromNonce(nonce, account.publicAccount),
            mosaicFlags,
            divisibility,
            blocksDuration ? blocksDuration : UInt64.fromUint(0),
            profile.networkType);

        const mosaicSupplyChangeTransaction = MosaicSupplyChangeTransaction.create(
            Deadline.create(),
            mosaicDefinitionTransaction.mosaicId,
            MosaicSupplyChangeAction.Increase,
            amount,
            profile.networkType,
        );

        const aggregateTransaction = AggregateTransaction.createComplete(
            Deadline.create(),
            [
                mosaicDefinitionTransaction.toAggregate(account.publicAccount),
                mosaicSupplyChangeTransaction.toAggregate(account.publicAccount),
            ],
            profile.networkType,
            [],
            maxFee);
        const signedTransaction = account.sign(aggregateTransaction, profile.networkGenerationHash);
        console.log(chalk.green('Your mosaic id is: '), mosaicDefinitionTransaction.mosaicId.toHex());
        this.announceTransaction(signedTransaction, profile.url);
    }
}
