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
import {AccountHttp, MosaicHttp, MosaicId, MosaicService} from 'nem2-sdk';
import {OptionsResolver} from '../../options-resolver';
import {ProfileCommand, ProfileOptions} from '../../profile.command';
import {MosaicCLIService} from '../../service/mosaic.service';

export class CommandOptions extends ProfileOptions {
    @option({
        flag: 'h',
        description: 'Mosaic id in hexadecimal format. Example: 941299B2B7E1291C',
    })
    hex: string;
}

@command({
    description: 'Fetch mosaic info',
})
export default class extends ProfileCommand {
    public readonly mosaicCLIService: MosaicCLIService;

    constructor() {
        super();
        this.mosaicCLIService = new MosaicCLIService();

    }

    @metadata
    execute(options: CommandOptions) {
        this.spinner.start();
        const profile = this.getProfile(options);
        if (!options.hex) {
            options.hex = OptionsResolver(options,
                'hex',
                () => undefined,
                'Introduce the mosaic id in hexadecimal format. Example: 941299B2B7E1291C');
        }
        let mosaicId: MosaicId;
        if (options.hex) {
            mosaicId = new MosaicId(options.hex);
        } else {
            throw new ExpectedError('Introduce a mosaicId. Example: 941299B2B7E1291C');
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
                    console.log(this.mosaicCLIService.formatMosaicView(mosaicViews[0]));
                }
            }, (err) => {
                this.spinner.stop(true);
                let text = '';
                text += chalk.red('Error');
                console.log(text, err.response !== undefined ? err.response.text : err);
            });
    }

}
