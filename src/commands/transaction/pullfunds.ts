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
import {command, ExpectedError, metadata, option, ValidationContext, Validator} from 'clime';
import {
    AccountHttp,
    Address,
    AggregateTransaction,
    Deadline,
    EmptyMessage,
    Listener,
    LockFundsTransaction,
    Mosaic,
    MosaicId,
    PlainMessage,
    TransactionHttp,
    TransferTransaction,
    UInt64,
    XEM,
} from 'nem2-sdk';
import {AddressValidator} from '../../address.validator';
import prompt from '../../inquirerHelper';
import * as validator from '../../inquirerHelper/validator';
import {OptionsResolver} from '../../options-resolver';
import {ProfileCommand, ProfileOptions} from '../../profile.command';

export class MosaicValidator implements Validator<string> {
    validate(value: string, context: ValidationContext): void {
        const mosaicParts = value.split('::');
        try {
            if (isNaN(+mosaicParts[1])) {
                throw new ExpectedError('');
            }
            const mosaic = new Mosaic(new MosaicId(mosaicParts[0]),
                UInt64.fromUint(+mosaicParts[1]));
        } catch (err) {
            throw new ExpectedError('mosaic should be in format namespaceName:mosaicName::absoluteAmount' +
                'ex: sending 1 XEM, nem:xem::1000000');
        }
    }
}

export class CommandOptions extends ProfileOptions {
    @option({
        flag: 'r',
        description: 'Funds holder address',
        validator: new AddressValidator(),
    })
    recipient: string;

    @option({
        flag: 'm',
        description: 'Message to the funds holder',
    })
    message: string;

    @option({
        flag: 'x',
        description: 'Mosaic you want to get in the format namespaceName:mosaicName::absoluteAmount',
        validator: new MosaicValidator(),
    })
    mosaic: string;

    getMosaic(): Mosaic {
        const mosaicParts = this.mosaic.split('::');
        return new Mosaic(new MosaicId(mosaicParts[0]),
            UInt64.fromUint(+mosaicParts[1]));
    }
}

@command({
    description: 'Create a pull transaction requesting xem to an account',
})

export default class extends ProfileCommand {

    constructor() {
        super();
    }

    @metadata
    async execute(options: CommandOptions) {
        const profile = this.getProfile(options);

        let recipient: Address;
        try {
            recipient = Address.createFromRawAddress(await OptionsResolver(options,
                'recipient',
                () => undefined,
                'Introduce funds holder address:',
                prompt({
                    type: 'input',
                    validate: validator.address(),
                })));
        } catch (err) {
            throw new ExpectedError('Introduce a valid address');
        }
        if (recipient.networkType !== profile.networkType) {
            throw new ExpectedError('recipient network doesn\'t match network option');
        }

        const accountHttp = new AccountHttp(profile.url);

        this.spinner.start();
        accountHttp.getAccountInfo(recipient)
            .subscribe(async (accountInfo) => {
                this.spinner.stop(true);

                const message = PlainMessage.create(await OptionsResolver(options,
                        'message',
                        () => undefined,
                        'Introduce message to the funds holder:',
                        prompt({
                            type: 'input',
                            validate: (input: string) => true,
                        })));

                options.mosaic = await OptionsResolver(options,
                    'mosaic',
                    () => undefined,
                    'Introduce pull mosaic in the format namespaceName:mosaicName::absoluteAmount,' +
                    ' (Ex: 1 XEM, nem:xem::1000000):',
                    prompt({
                        type: 'input',
                        validate: (input: string) => true,
                    }));

                const mosaics = [options.getMosaic()];

                const requestFundsTx = TransferTransaction.create(Deadline.create(), recipient, [], message, profile.networkType);
                const fundsTx = TransferTransaction.create(Deadline.create(),
                    profile.account.address, mosaics, EmptyMessage, profile.networkType);

                const aggregateTx = AggregateTransaction.createBonded(Deadline.create(),
                    [requestFundsTx.toAggregate(profile.account.publicAccount), fundsTx.toAggregate(accountInfo.publicAccount)],
                    profile.networkType, []);

                const signedTransaction = profile.account.sign(aggregateTx);

                const lockFundsTransaction = LockFundsTransaction.create(
                    Deadline.create(),
                    XEM.createRelative(10),
                    UInt64.fromUint(1000),
                    signedTransaction,
                    profile.networkType,
                );

                const lockFundsSignedTransaction = profile.account.sign(lockFundsTransaction);

                const transactionHttp = new TransactionHttp(profile.url);
                const listener = new Listener(profile.url);

                listener.open().then(() => {
                    transactionHttp.announce(lockFundsSignedTransaction).subscribe(() => {
                        console.log(chalk.green('Announce lock funds transaction'));
                        console.log('Hash:   ', lockFundsSignedTransaction.hash);
                        console.log('Signer: ', lockFundsSignedTransaction.signer, '\n');
                        console.log(chalk.green('Waiting for confirmation to announce pull funds transaction\n'));
                    });
                    listener.confirmed(profile.account.address).subscribe((transaction) => {
                        if (transaction.transactionInfo && transaction.transactionInfo.hash === lockFundsSignedTransaction.hash) {
                            transactionHttp.announceAggregateBonded(signedTransaction).subscribe(() => {
                                console.log(chalk.green('Pull funds transaction announced'));
                                console.log('Hash:   ', signedTransaction.hash);
                                console.log('Signer: ', signedTransaction.signer);
                                listener.close();
                            }, (err) => {
                                listener.close();
                                this.spinner.stop(true);
                                let text = '';
                                text += chalk.red('Error');
                                console.log(text, err.response !== undefined ? err.response.text : err);
                            });
                        }
                    });
                });
            }, (err) => {
                this.spinner.stop(true);
                let text = '';
                text += chalk.red('Error');
                console.log(text, err.response !== undefined ? err.response.text : err);
            });
    }
}
