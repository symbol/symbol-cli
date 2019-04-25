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
import {AccountHttp, MosaicHttp, MosaicId, MosaicService} from 'nem2-sdk';
import {OptionsResolver} from '../../options-resolver';
import {ProfileCommand, ProfileOptions} from '../../profile.command';

export class CommandOptions extends ProfileOptions {
    @option({
        flag: 'h',
        description: 'Mosaic Id in hexadecimal format',
    })
    hex: string;

    @option({
        flag: 'u',
        description: 'Mosaic id in uint64 format. [number, number]',
    })
    uint: string;
}

@command({
    description: 'Fetch Mosaic info',
})
export default class extends ProfileCommand {

    constructor() {
        super();
    }

    @metadata
    execute(options: CommandOptions) {
        this.spinner.start();
        const profile = this.getProfile(options);
        if (!options.hex && !options.uint) {
            options.hex = OptionsResolver(options,
                'hex',
                () => undefined,
                'Introduce the mosaic id in hexadecimal format: ');
        }

        let mosaicId: MosaicId;
        if (options.hex) {
            mosaicId = new MosaicId(options.hex);
        } else if (options.uint) {
            mosaicId = new MosaicId(JSON.parse(options.uint));
        } else {
            throw new ExpectedError('You need to introduce a mosaicId');
        }

        const mosaicService = new MosaicService(
            new AccountHttp(profile.url),
            new MosaicHttp(profile.url),
        );

        mosaicService.mosaicsView([mosaicId])
            .subscribe((mosaicViews) => {
                this.spinner.stop(true);
                if (mosaicViews.length === 0) {
                    console.log('No mosaic exists with this id ' + mosaicId.toHex());
                } else {
                    const mosaicView = mosaicViews[0];
                    let text = '';
                    text += chalk.green('Mosaic:\t');
                    text += 'Hex:\t' + mosaicId.toHex() + '\n';
                    text += 'Uint64:\t\t[ ' + mosaicId.id.lower + ', ' + mosaicId.id.higher + ' ]\n\n';
                    text += 'divisibility:\t' + mosaicView.mosaicInfo.divisibility + '\n';
                    text += 'transferable:\t' + mosaicView.mosaicInfo.isTransferable() + '\n';
                    text += 'supply mutable:\t' + mosaicView.mosaicInfo.isSupplyMutable() + '\n';
                    text += 'block height:\t' + mosaicView.mosaicInfo.height.compact() + '\n';
                    if (mosaicView.mosaicInfo.duration) {
                        text += 'duration:\t' + mosaicView.mosaicInfo.duration.compact() + '\n';
                    }
                    text += 'owner:\t\t' + mosaicView.mosaicInfo.owner.address.pretty() + '\n';
                    text += 'supply:\t\t' + mosaicView.mosaicInfo.supply.compact() + '\n';
                    console.log(text);
                }

            }, (err) => {
                this.spinner.stop(true);
                let text = '';
                text += chalk.red('Error');
                console.log(text, err.response !== undefined ? err.response.text : err);
            });
    }
}
