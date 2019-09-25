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
import {command, ExpectedError, metadata, option} from 'clime';
import {Address, Deadline, Mosaic, NamespaceId, PlainMessage, TransactionHttp, TransferTransaction, UInt64} from 'nem2-sdk';
import {OptionsResolver} from '../../options-resolver';
import {ProfileCommand, ProfileOptions} from '../../profile.command';
import {MosaicService} from '../../service/mosaic.service';
import {AddressValidator} from '../../validators/address.validator';
import {MaxFeeValidator} from '../../validators/maxFee.validator';
import {MosaicsValidator} from '../../validators/mosaic.validator';

export class CommandOptions extends ProfileOptions {
    @option({
        flag: 'r',
        description: 'Recipient (address or @alias)',
        validator: new AddressValidator(),
    })
    recipient: string;

    @option({
        flag: 'm',
        description: 'Transaction message',
    })
    message: string;

    @option({
        flag: 'c',
        description: 'Mosaic you want to transfer in the format (mosaicId(hex)|@aliasName)::absoluteAmount',
        validator: new MosaicsValidator(),
    })
    mosaics: string;

    @option({
        flag: 'f',
        description: 'Maximum fee',
        validator: new MaxFeeValidator(),
    })
    maxfee: number;

    getMosaics(): Mosaic[] {
        const mosaics: Mosaic[] = [];
        const mosaicsData = this.mosaics.split(',');
        mosaicsData.forEach((mosaicData) => {
            const mosaicParts = mosaicData.split('::');
            mosaics.push(new Mosaic(MosaicService.getMosaicId(mosaicParts[0]),
                UInt64.fromUint(+mosaicParts[1])));
        });
        return mosaics;
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

        const recipient: Address | NamespaceId = MosaicService.getRecipient(OptionsResolver(options,
            'recipient',
            () => undefined,
            'Introduce the recipient address: '));
        if (recipient instanceof Address && recipient.networkType !== profile.networkType) {
            throw new ExpectedError('recipient network doesn\'t match network option');
        }

        let mosaics: Mosaic[] = [];
        options.mosaics = OptionsResolver(options,
            'mosaics',
            () => undefined,
            'Mosaics you want to transfer in the format (mosaicId(hex)|@aliasName)::absoluteAmount,' +
            ' (Ex: sending 1 cat.currency, @cat.currency::1000000). Add multiple mosaics with commas:\n> ');
        if (options.mosaics) {
            mosaics = options.getMosaics();
        }

        let message: string;
        message = options.recipient ? (options.message || '') : OptionsResolver(options,
            'message',
            () => undefined,
            'Introduce the message: ');

        options.maxfee = OptionsResolver(options,
            'maxfee',
            () => undefined,
            'Introduce the maximum fee you want to spend to announce the transaction: ');

        const transferTransaction = TransferTransaction.create(Deadline.create(), recipient, mosaics,
            PlainMessage.create(message), profile.networkType, UInt64.fromUint(options.maxfee));

        const signedTransaction = profile.account.sign(transferTransaction, profile.networkGenerationHash);

        const transactionHttp = new TransactionHttp(profile.url);

        transactionHttp.announce(signedTransaction).subscribe(() => {
            console.log(chalk.green('Transaction announced correctly'));
            console.log('Hash:   ', signedTransaction.hash);
            console.log('SignerPublicKey: ', signedTransaction.signerPublicKey);
        }, (err) => {
            this.spinner.stop(true);
            let text = '';
            text += chalk.red('Error');
            console.log(text, err.response !== undefined ? err.response.text : err);
        });
    }
}
