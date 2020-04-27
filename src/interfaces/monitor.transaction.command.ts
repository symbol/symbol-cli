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
import {ProfileCommand} from './profile.command'
import {ProfileOptions} from './profile.options'
import {option} from 'clime'

/**
 * Base command class to listen the blockchain.
 */
export abstract class MonitorAddressCommand extends ProfileCommand {

    /**
     * Constructor.
     */
    protected constructor() {
        super()
    }
}

/**
 * Monitor address options.
 */
export class MonitorAddressOptions extends ProfileOptions {
    @option({
        flag: 'a',
        description: 'Account address.',
    })
    address: string
}
