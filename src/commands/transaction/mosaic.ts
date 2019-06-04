/*
 *
 * Copyright 2018 NEM
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
    MosaicId,
    MosaicNonce,
    MosaicProperties,
    MosaicSupplyChangeTransaction,
    MosaicSupplyType,
    TransactionHttp,
    UInt64,
} from 'nem2-sdk';
import * as readlineSync from 'readline-sync';
import {OptionsResolver} from '../../options-resolver';
import {ProfileCommand, ProfileOptions} from '../../profile.command';

export class CommandOptions extends ProfileOptions {
    @option({
        flag: 'a',
        description: 'Amount of tokens',
    })
    amount: number;

    @option({
        flag: 't',
        description: 'Mosaic transferable',
        toggle: true,
    })
    transferable: any;

    @option({
        flag: 's',
        description: 'Mosaic supply mutable',
        toggle: true,
    })
    supplymutable: any;

    @option({
        flag: 'l',
        description: 'Mosaic levy mutable',
        toggle: true,
    })
    levymutable: any;

    @option({
        flag: 'd',
        description: 'Mosaic divisibility, from 0 to 6',
    })
    divisibility: number;

    @option({
        flag: 'u',
        description: 'Mosaic duration in amount of blocks',
    })
    duration: number;

    @option({
        flag: 'e',
        description: 'eternal',
        toggle: true,
    })
    eternal: any;

}

@command({
    description: 'Mosaic creation transaction',
})

export default class extends ProfileCommand {

    constructor() {
        super();
    }

    @metadata
    execute(options: CommandOptions) {

        const profile = this.getProfile(options);
        const nonce = MosaicNonce.createRandom();
        let blocksDuration;
        if (!options.eternal) {
            if (!readlineSync.keyInYN('Do you want an eternal mosaic?')) {
                blocksDuration = UInt64.fromUint( OptionsResolver(options,
                    'duration',
                    () => undefined,
                    'Introduce the duration in blocks: '));
            }
        }
        const mosaicDefinitionTransaction = MosaicDefinitionTransaction.create(
            Deadline.create(),
            nonce,
            MosaicId.createFromNonce(nonce, profile.account.publicAccount),
            MosaicProperties.create({
                duration: blocksDuration,
                divisibility: OptionsResolver(options,
                    'divisibility',
                    () => undefined,
                    'Introduce mosaic divisibility: '),
                supplyMutable: options.supplymutable ? options.supplymutable : readlineSync.keyInYN(
                    'Do you want mosaic to have supply mutable?'),
                transferable: options.transferable ? options.transferable : readlineSync.keyInYN(
                    'Do you want mosaic to be transferable?'),
            }),
            profile.networkType,
        );

        const mosaicSupplyChangeTransaction = MosaicSupplyChangeTransaction.create(
            Deadline.create(),
            mosaicDefinitionTransaction.mosaicId,
            MosaicSupplyType.Increase,
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
        );
        const signedTransaction = profile.account.sign(aggregateTransaction, profile.networkGenerationHash);

        const transactionHttp = new TransactionHttp(profile.url);

        transactionHttp.announce(signedTransaction).subscribe(() => {
            console.log(chalk.green('Transaction announced correctly'));
            console.log('Hash:   ', signedTransaction.hash);
            console.log('Signer: ', signedTransaction.signer);
            console.log(chalk.green('Your mosaic id is:'));
            console.log('Hex: ', mosaicDefinitionTransaction.mosaicId.toHex());
            console.log('Uint64: [', mosaicDefinitionTransaction.mosaicId.id.lower, mosaicDefinitionTransaction.mosaicId.id.higher + ']');
        }, (err) => {
            this.spinner.stop(true);
            let text = '';
            text += chalk.red('Error');
            console.log(text, err.response !== undefined ? err.response.text : err);
        });
    }
}
