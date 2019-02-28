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
import {command, ExpectedError, metadata, option} from 'clime';
import {
    Address,
    Deadline,
    Mosaic,
    MosaicId,
    NamespaceId,
    PlainMessage,
    TransactionHttp,
    TransferTransaction,
    UInt64
} from 'nem2-sdk';
import {AddressValidator} from '../../address.validator';
import {OptionsResolver} from '../../options-resolver';
import {ProfileCommand, ProfileOptions} from '../../profile.command';

export class CommandOptions extends ProfileOptions {
    @option({
        flag: 'r',
        description: 'Recipient',
        validator: new AddressValidator(),
    })
    recipient: string;

    @option({
        flag: 'm',
        description: 'Transaction message',
        default: '',
    })
    message: string;

    @option({
        flag: 'c',
        description: 'Mosaic you want to get in the format (mosaicId(hex)|?aliasName)::absoluteAmount',
    })
    mosaics: string;

    getMosaics(): Mosaic[] {
        this.validateMosaics(this.mosaics);
        const mosaics: Mosaic[] = [];
        const mosaicsData = this.mosaics.split(',');
        mosaicsData.forEach((mosaicData) => {
            const mosaicParts = mosaicData.split('::');
            let mosaicId;
            if (mosaicParts[0][0] === '?') {
                mosaicId = new NamespaceId(mosaicParts[0].substring(1));
            } else {
                mosaicId = new MosaicId(mosaicParts[0]);
            }
            mosaics.push(new Mosaic(mosaicId,
                UInt64.fromUint(+mosaicParts[1])));
        });
        return mosaics;
    }

    validateMosaics(value: string) {
        const mosaics = value.split(',');
        mosaics.forEach((mosaicData) => {
            const mosaicParts = mosaicData.split('::');
            try {
                if (isNaN(+mosaicParts[1])) {
                    throw new ExpectedError('');
                }
                let mosaicId;
                if (mosaicParts[0][0] === '?') {
                    mosaicId = new MosaicId(mosaicParts[0].substring(1));
                } else {
                    const mosaicIdUint64 = UInt64.fromHex(mosaicParts[0]);
                    mosaicId = new MosaicId([mosaicIdUint64.lower, mosaicIdUint64.higher]);
                }
                const mosaic = new Mosaic(mosaicId,
                    UInt64.fromUint(+mosaicParts[1]));
            } catch (err) {
                throw new ExpectedError('Mosaic you want to get in the format (mosaicId(hex)|?aliasName)::absoluteAmount,' +
                    ' (Ex: sending 1 cat.currency, ?cat.currency::1000000)');
            }
        });
    }
}

@command({
    description: 'Send transfer transaction',
})

export default class extends ProfileCommand {

    constructor() {
        super();
    }

    @metadata
    execute(options: CommandOptions) {
        const profile = this.getProfile(options);

        let recipient: Address;
        try {
            recipient = Address.createFromRawAddress(
                OptionsResolver(options,
                    'recipient',
                    () => undefined,
                    'Introduce the recipient address: '));
        } catch (err) {
            throw new ExpectedError('Introduce a valid address');
        }

        if (recipient.networkType !== profile.networkType) {
            throw new ExpectedError('recipient network doesn\'t match network option');
        }

        let mosaics: Mosaic[] = [];

        options.mosaics = OptionsResolver(options,
            'mosaics',
            () => undefined,

            'Mosaic you want to get in the format (mosaicId(hex)|?aliasName)::absoluteAmount,' +
            ' (Ex: sending 1 cat.currency, ?cat.currency::1000000). Add multiple mosaics with commas:\n> ');

        if (options.mosaics) {
            mosaics = options.getMosaics();
        }

        const message = PlainMessage.create(
            OptionsResolver(options,
                'message',
                () => undefined,
                'Introduce the message: '));

        const transferTransaction = TransferTransaction.create(Deadline.create(), recipient, mosaics, message, profile.networkType);

        const signedTransaction = profile.account.sign(transferTransaction);

        const transactionHttp = new TransactionHttp(profile.url);

        transactionHttp.announce(signedTransaction).subscribe(() => {
            console.log(chalk.green('Transaction announced correctly'));
            console.log('Hash:   ', signedTransaction.hash);
            console.log('Signer: ', signedTransaction.signer);
        }, (err) => {
            this.spinner.stop(true);
            let text = '';
            text += chalk.red('Error');
            console.log(text, err.response !== undefined ? err.response.text : err);
        });
    }
}
