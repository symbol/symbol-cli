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
import {AccountHttp, MosaicHttp, MosaicId, MosaicService, NamespaceHttp} from 'nem2-sdk';
import prompt from '../../inquirerHelper';
import * as validator from '../../inquirerHelper/validator';
import {OptionsResolver} from '../../options-resolver';
import {ProfileCommand, ProfileOptions} from '../../profile.command';

export class CommandOptions extends ProfileOptions {
    @option({
        flag: 'n',
        description: 'Mosaic Id in string format',
    })
    name: string;

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
    async execute(options: CommandOptions) {
        const profile = this.getProfile(options);

        if (!options.uint) {
            options.name = await OptionsResolver(options,
                'name',
                () => undefined,
                'Introduce the mosaic name:',
                prompt({
                    type: 'input',
                    validate: (input) => input.length === 0 || validator.mosaicFqn()(input),
                }),
            );
        }
        if (options.name === '') {
            options.uint = await OptionsResolver(options,
                'uint',
                () => undefined,
                'Introduce the mosaic id in uint64 format. [number, number]:',
                prompt({
                    type: 'input',
                    filter: (input: string) => input.trim().replace(/\s+/g, ' '),
                    validate: validator.uint64(),
                }),
            );
        }

        let mosaicId: MosaicId;
        if (options.name) {
            mosaicId = new MosaicId(options.name);
        } else if (options.uint) {
            mosaicId = new MosaicId(JSON.parse(options.uint));
        } else {
            throw new ExpectedError('You need to introduce at least one');
        }

        const mosaicService = new MosaicService(
            new AccountHttp(profile.url),
            new MosaicHttp(profile.url),
            new NamespaceHttp(profile.url),
        );

        this.spinner.start();
        mosaicService.mosaicsView([mosaicId])
            .subscribe((mosaicViews) => {
                this.spinner.stop(true);
                if (mosaicViews.length === 0) {
                    console.log('No mosaic exists with this id ' + mosaicId.toHex());
                } else {
                    const mosaicView = mosaicViews[0];
                    let text = '';
                    text += chalk.green('Mosaic:\t') + chalk.bold(mosaicView.fullName()) + '\n';
                    text += '-'.repeat('Mosaic:\t'.length + mosaicView.fullName().length) + '\n\n';
                    text += 'hexadecimal:\t' + mosaicId.toHex() + '\n';
                    text += 'uint:\t\t[ ' + mosaicId.id.lower + ', ' + mosaicId.id.higher + ' ]\n\n';
                    text += 'divisibility:\t' + mosaicView.mosaicInfo.divisibility + '\n';
                    text += 'transferable:\t' + mosaicView.mosaicInfo.isTransferable() + '\n';
                    text += 'supply mutable:\t' + mosaicView.mosaicInfo.isSupplyMutable() + '\n';
                    text += 'active:\t\t' + mosaicView.mosaicInfo.active + '\n';
                    text += 'block height:\t' + mosaicView.mosaicInfo.height.compact() + '\n';
                    text += 'duration:\t' + mosaicView.mosaicInfo.duration.compact() + '\n';
                    text += 'owner:\t\t' + mosaicView.mosaicInfo.owner.address.pretty() + '\n';
                    text += 'supply:\t\t' + mosaicView.mosaicInfo.supply.compact() + '\n';
                    text += 'namespaceId hex: ' + mosaicView.mosaicInfo.namespaceId.toHex() + '\n';
                    text += 'namespaceId uint: [ ' + mosaicView.mosaicInfo.namespaceId.id.lower + ', ' +
                        '' + mosaicView.mosaicInfo.namespaceId.id.higher + ' ]\n\n';
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
