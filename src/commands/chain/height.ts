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
import {ProfileCommand} from '../../interfaces/profile.command'
import {ProfileOptions} from '../../interfaces/profile.options'
import {HttpErrorHandler} from '../../services/httpErrorHandler.service'
import {command, metadata} from 'clime'
import {ChainHttp} from 'symbol-sdk'

@command({
    description: 'Get the current height of the chain',
})
export default class extends ProfileCommand {

    constructor() {
        super()
    }

    @metadata
    execute(options: ProfileOptions) {
        const profile = this.getProfile(options)

        this.spinner.start()
        const chainHttp = new ChainHttp(profile.url)
        chainHttp.getBlockchainHeight().subscribe((height) => {
            this.spinner.stop(true)
            console.log(height.toString())
        }, (err) => {
            this.spinner.stop(true)
            console.log(HttpErrorHandler.handleError(err))
        })
    }
}
