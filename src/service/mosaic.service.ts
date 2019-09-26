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
import * as Table from 'cli-table3';
import {HorizontalTable} from 'cli-table3';
import {ExpectedError} from 'clime';
import {Address, Mosaic, MosaicId, MosaicView, NamespaceId, UInt64} from 'nem2-sdk';

export class MosaicCLIService {

    public static ALIAS_TAG = '@';

    constructor() {

    }

    static validate(value: string) {
        const mosaicParts = value.split('::');
        let valid = true;
        try {
            if (isNaN(+mosaicParts[1])) {
                valid = false;
            }
            const ignored = new Mosaic(this.getMosaicId(mosaicParts[0]),
                UInt64.fromUint(+mosaicParts[1]));
        } catch (err) {
            valid = false;
        }
        if (!valid) {
            throw new ExpectedError('Mosaic should be in the format (mosaicId(hex)|@aliasName)::absoluteAmount,' +
                ' (Ex: sending 1 cat.currency, @cat.currency::1000000)');
        }
    }

    static getRecipient(rawRecipient: string): Address | NamespaceId {
        let recipient: Address | NamespaceId;
        if (rawRecipient.charAt(0) === MosaicCLIService.ALIAS_TAG) {
            recipient =  new NamespaceId(rawRecipient.substring(1));
        } else  {
            try {
                recipient = Address.createFromRawAddress(rawRecipient);
            } catch (err) {
                throw new ExpectedError('Introduce a valid address');
            }
        }
        return recipient;
    }

    static getMosaicId(rawMosaicId: string): MosaicId | NamespaceId {
        let mosaicId: MosaicId | NamespaceId;
        if (rawMosaicId.charAt(0) === MosaicCLIService.ALIAS_TAG) {
            mosaicId = new NamespaceId(rawMosaicId.substring(1));
        } else {
            mosaicId = new MosaicId(rawMosaicId);
        }
        return mosaicId;
    }

    static getMosaics(rawMosaics: string): Mosaic[] {
        const mosaics: Mosaic[] = [];
        const mosaicsData = rawMosaics.split(',');
        mosaicsData.forEach((mosaicData) => {
            const mosaicParts = mosaicData.split('::');
            mosaics.push(new Mosaic(this.getMosaicId(mosaicParts[0]),
                UInt64.fromUint(+mosaicParts[1])));
        });
        return mosaics;
    }

    public formatMosaicView(mosaicView: MosaicView) {
        const table = new Table({
            style: {head: ['cyan']},
            head: ['Property', 'Value'],
        }) as HorizontalTable;
        let text = '';
        text += '\n\n' + chalk.green('Mosaic Information') + '\n';
        table.push(
            ['Id', mosaicView.mosaicInfo.id.toHex()],
            ['Divisibility', mosaicView.mosaicInfo.divisibility],
            ['Transferable', mosaicView.mosaicInfo.isTransferable()],
            ['Supply Mutable',  mosaicView.mosaicInfo.isSupplyMutable()],
            ['Height', mosaicView.mosaicInfo.height.compact()],
            ['Duration', mosaicView.mosaicInfo.height.compact() === 0 ?
                'Never' : (mosaicView.mosaicInfo.height.compact() + mosaicView.mosaicInfo.duration.compact()).toString()],
            ['Owner', mosaicView.mosaicInfo.owner.address.pretty()],
            ['Supply (Absolute)', mosaicView.mosaicInfo.supply.compact()],
            ['Supply (Relative)', mosaicView.mosaicInfo.divisibility === 0 ? mosaicView.mosaicInfo.supply.compact().toLocaleString()
                : (mosaicView.mosaicInfo.supply.compact() / Math.pow(10, mosaicView.mosaicInfo.divisibility)).toLocaleString()],
        );
        text += table.toString();
        return text;
    }
}
