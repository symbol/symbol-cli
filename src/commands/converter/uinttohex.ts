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
import {command, ExpectedError, metadata, option} from 'clime';
import {ProfileCommand, ProfileOptions} from '../../profile.command';
import {OptionsResolver} from "../../options-resolver";
import {Id, Mosaic, MosaicId} from "nem2-sdk";

export class CommandOptions extends ProfileOptions {
    @option({
        flag: 'm',
        description: ' a hexadecimal mosaic  ',
    })
    mosaic: string;
}

@command({
    description: 'Converts a hexadecimal mosaic to a uint64 object',
})
export default class extends ProfileCommand {

    constructor() {
        super();
    }
    @metadata
    execute(options: ProfileOptions) {

        const mosaic  = OptionsResolver(options,
            'mosaic',
            () => undefined,
            'Introduce the  a hexadecimal mosaic : ');
        try {
            const rst =  new MosaicId(mosaic);
            console.log(rst);
        } catch (err) {
            throw new ExpectedError('introduce a valid mosaic');
        }
    }
}
