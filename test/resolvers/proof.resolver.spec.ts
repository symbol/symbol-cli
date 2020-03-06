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
import {ProofResolver} from '../../src/resolvers/proof.resolver'

describe('Proof resolver', () => {

    it('should return proof', async () => {
        const proof = 'proof'
        const options = {proof} as any
        expect(await new ProofResolver().resolve(options))
            .to.be.equal(proof)
    })

    it('should change key', async () => {
        const key = 'proof'
        const options = {key} as any
        expect(await new ProofResolver()
            .resolve(options, 'altText', 'key'))
            .to.be.equal(key)
    })

})
