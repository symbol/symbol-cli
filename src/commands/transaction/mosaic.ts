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
import {OptionsResolver} from '../../options-resolver';

export class CommandOptions extends AnnounceTransactionsOptions {
    @option({
        flag: 'a',
        description: 'Initial supply of mosaics.',
    })
    amount: number;

    @option({
        flag: 't',
        description: 'Mosaic transferable.',
        toggle: true,
    })
    transferable: any;

    @option({
        flag: 's',
        description: 'Mosaic supply mutable.',
        toggle: true,
    })
    supplyMutable: any;

    @option({
        flag: 'r',
        description: 'Mosaic restrictable.',
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
    })
    duration: number;

    @option({
        flag: 'n',
        description: 'Mosaic non-expiring.',
        toggle: true,
    })
    nonExpiring: any;

}

@command({
    description: 'Mosaic creation transaction',
})

export default class extends AnnounceTransactionsCommand {

    constructor() {
        super();
    }

    @metadata
    execute(options: CommandOptions) {

        const profile = this.getProfile(options);
        const nonce = MosaicNonce.createRandom();
        let blocksDuration;
        if (!options.nonExpiring) {
            if (!readlineSync.keyInYN('Do you want an non-expiring mosaic?')) {
                blocksDuration = UInt64.fromUint( OptionsResolver(options,
                    'duration',
                    () => undefined,
                    'Introduce the duration in blocks: '));
            }
        }

        options.maxFee = OptionsResolver(options,
            'maxFee',
            () => undefined,
            'Introduce the maximum fee you want to spend to announce the transaction: ');

        if (undefined === options.divisibility) {
            options.divisibility = OptionsResolver(options,
                'divisibility',
                () => undefined,
                'Introduce mosaic divisibility: ');
        }
        const mosaicDefinitionTransaction = MosaicDefinitionTransaction.create(
            Deadline.create(),
            nonce,
            MosaicId.createFromNonce(nonce, profile.account.publicAccount),
            MosaicFlags.create(
                options.supplyMutable ? options.supplyMutable : readlineSync.keyInYN(
                    'Do you want mosaic to have supply mutable?'),
                    options.transferable ? options.transferable : readlineSync.keyInYN(
                        'Do you want mosaic to be transferable?'),
                options.restrictable ? options.restrictable : readlineSync.keyInYN(
                    'Do you want mosaic to be restrictable?'),
            ),
            options.divisibility,
            blocksDuration ? blocksDuration : UInt64.fromUint(0),
            profile.networkType,
            UInt64.fromUint(options.maxFee),
        );

        const mosaicSupplyChangeTransaction = MosaicSupplyChangeTransaction.create(
            Deadline.create(),
            mosaicDefinitionTransaction.mosaicId,
            MosaicSupplyChangeAction.Increase,
            UInt64.fromUint(OptionsResolver(options,
                'amount',
                () => undefined,
                'Introduce amount of tokens: ')),
            profile.networkType,
        );

        const aggregateTransaction = AggregateTransaction.createComplete(
            Deadline.create(),
            [
                mosaicDefinitionTransaction.toAggregate(profile.account.publicAccount),
                mosaicSupplyChangeTransaction.toAggregate(profile.account.publicAccount),
            ],
            profile.networkType,
            [],
            UInt64.fromUint(options.maxFee),
        );
        const signedTransaction = profile.account.sign(aggregateTransaction, profile.networkGenerationHash);
        console.log(chalk.green('Your mosaic id is: '), mosaicDefinitionTransaction.mosaicId.toHex());
        this.announceTransaction(signedTransaction, profile.url);
    }
}
