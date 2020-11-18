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
import { command, metadata } from 'clime';
import { CreateProfileCommand } from '../../interfaces/create.profile.command';
import { ProfileOptions } from '../../interfaces/profile.options';
import { ProfileNameResolver } from '../../resolvers/profile.resolver';
import { FormatterService } from '../../services/formatter.service';

export class CommandOptions extends ProfileOptions {}

@command({
    description: 'Change the default profile',
})
export default class extends CreateProfileCommand {
    constructor() {
        super();
    }

    @metadata
    async execute(options: CommandOptions) {
        const profileName = await new ProfileNameResolver().resolve(options, undefined, 'New default profile:');
        if (profileName) {
            this.setDefaultProfile(profileName);
            console.log(FormatterService.success('Default profile changed to [' + profileName + ']'));
        }
    }
}
