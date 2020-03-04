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
import {ProfileNameResolver} from '../../src/resolvers/profile.resolver'
import {ProofResolver} from '../../src/resolvers/proof.resolver'

describe('Proof resolver', () => {

    it('should return proof', async () => {
        const proof = 'proof'
        const profileOptions = {proof} as any
        expect(await new ProofResolver().resolve(profileOptions))
            .to.be.equal(proof)
    })

    it('should change key', async () => {
        const key = 'proof'
        const profileOptions = {key} as any
        expect(await new ProofResolver()
            .resolve(profileOptions, undefined, 'altText', 'key'))
            .to.be.equal(key)
    })

})
