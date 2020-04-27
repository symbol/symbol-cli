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
import {expect} from 'chai'
import {LockHashAlgorithm} from 'symbol-sdk'
import {ProofResolver} from '../../src/resolvers/proof.resolver'

describe('Proof resolver', () => {
    it('should return proof', async () => {
        const proof = '64CHAR0000000000000000000000000000000000000000000000000000000000'
        expect(await new ProofResolver().resolve({proof} as any, LockHashAlgorithm.Op_Hash_160))
            .to.be.equal(proof)
    })

    it('should return proof with a length of 40 when declared as Op_Hash_160', async () => {
        const proof = '40CHAR0000000000000000000000000000000000'
        expect(await new ProofResolver().resolve({proof} as any, LockHashAlgorithm.Op_Hash_160))
            .to.be.equal(proof)
    })

    it('should change key', async () => {
        const key = '64CHAR0000000000000000000000000000000000000000000000000000000000'
        const options = {key} as any
        expect(await new ProofResolver()
            .resolve(options, undefined, 'altText', 'key'))
            .to.be.equal(key)
    })
})
