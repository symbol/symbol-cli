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
import {ProofValidator} from '../../src/validators/proof.validator'
import {expect} from 'chai'
import {LockHashAlgorithm} from 'symbol-sdk'

describe('Proof validator', () => {

    it('default case ', () => {
        const upperCaseHash = '64CHAR0000000000000000000000000000000000000000000000000000000000'
        expect(new ProofValidator(undefined).validate(upperCaseHash))
            .to.be.true
    })

    it('should throw error if proof length is not 64 nor 40', () => {
        const privateKey = '63CHAR000000000000000000000000000000000000000000000000000000000'
        expect(
            new ProofValidator(undefined).validate(privateKey)
        ).to.be.equal('A proof should be 64 or 40 chars long.')
    })

    it('should accept a 40 chars hash if no hashType is specified', () => {
        const privateKey = '40CHARS000000000000000000000000000000000'
        expect(
            new ProofValidator(undefined).validate(privateKey)
        ).to.be.true
    })

    it('should accept a 64 chars hash if no hashType is specified', () => {
        const privateKey = '64CHAR0000000000000000000000000000000000000000000000000000000000'
        expect(
            new ProofValidator(undefined).validate(privateKey)
        ).to.be.true
    })

    it('should accept a 64 chars hash if a hashType is specified as HashType', () => {
        const privateKey = '64CHAR0000000000000000000000000000000000000000000000000000000000'
        expect(
            new ProofValidator(LockHashAlgorithm.Op_Hash_256).validate(privateKey)
        ).to.be.true
    })

    it('should throw error if proof length is not 64 when a 64 char long hash is specified', () => {
        const privateKey = '40CHARS000000000000000000000000000000000'
        expect(
            new ProofValidator(LockHashAlgorithm.Op_Hash_256).validate(privateKey)
        ).to.be.equal('A proof should be 64 chars long.')
    })
})
