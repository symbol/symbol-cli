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
import {MaxFeeResolver} from '../../src/resolvers/maxFee.resolver'
import {expect} from 'chai'

describe('Max fee resolver', () => {

    it('default case', async () => {
        const maxFee = '10'
        const options = {maxFee} as any
        expect((await new MaxFeeResolver().resolve(options)).compact())
            .to.be.equal(10)
    })

    it('should return 0', async () => {
        const maxFee = '0'
        const options = {maxFee} as any
        expect((await new MaxFeeResolver().resolve(options)).compact())
            .to.be.equal(0)
    })

    it('should change key', async () => {
        const maxFeeHashLock = '10'
        const options = {maxFeeHashLock} as any
        expect((await new MaxFeeResolver().resolve(options,
            'test', 'maxFeeHashLock')).compact())
            .to.be.equal(10)
    })

})

