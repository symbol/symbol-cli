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
import {HashAlgorithmResolver} from '../../src/resolvers/hashAlgorithm.resolver'
import {expect} from 'chai'
import {LockHashAlgorithm} from 'symbol-sdk'

describe('Hash algorithm resolver', () => {

    it('should return hash algorithm', async () => {
        const options = {hashAlgorithm: 'Op_Sha3_256'} as any
        expect(await new HashAlgorithmResolver().resolve(options))
            .to.be.equal(LockHashAlgorithm.Op_Sha3_256)
    })

    it('should change key', async () => {
        const options = {key: 'Op_Sha3_256'} as any
        expect(await new HashAlgorithmResolver()
            .resolve(options, 'altText', 'key'))
            .to.be.equal(LockHashAlgorithm.Op_Sha3_256)
    })
})
