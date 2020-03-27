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
import {HashType} from 'symbol-sdk'

describe('Proof validator', () => {

    it('default case ', () => {
        const upperCaseHash = '770DE78BF2AD0531BB7589C8839AB43F5764064785AB1E28160AEF7D3A4C2D4B'
        const lowerCaseHash = '770de78bf2ad0531bb7589c8839ab43f5764064785ab1e28160aef7d3a4c2d4b'
        expect(new ProofValidator('').validate(upperCaseHash))
            .to.be.true
        expect(new ProofValidator('').validate(lowerCaseHash))
            .to.be.true
    })

    it('should throw error if private key length is not 64 nor 46', () => {
        const privateKey = '770DE78BF2AD0531BB7589C8839AB43F5764064785AB1E28160AEF7D3A4C2D4'
        expect(
            new ProofValidator('').validate(privateKey)
        ).to.be.equal('A proof should be 64 or 46 chars long.')
    })

    it('should accept a 46 chars hash if no hashType is specified', () => {
        const privateKey = '46CHARS000000000000000000000000000000000000000'
        expect(
            new ProofValidator('').validate(privateKey)
        ).to.be.true
    })

    it('should accept a 64 chars hash if no hashType is specified', () => {
        const privateKey = '770de78bf2ad0531bb7589c8839ab43f5764064785ab1e28160aef7d3a4c2d4b'
        expect(
            new ProofValidator('').validate(privateKey)
        ).to.be.true
    })

    it('should accept a 64 chars hash if a hashType is specified as HashType', () => {
        const privateKey = '770de78bf2ad0531bb7589c8839ab43f5764064785ab1e28160aef7d3a4c2d4b'
        expect(
            new ProofValidator(HashType.Op_Hash_256).validate(privateKey)
        ).to.be.true
    })

    it('should throw error if private key length is not 64 when a 64 char long hash is specified', () => {
        const privateKey = '46CHARS000000000000000000000000000000000000000'
        expect(
            new ProofValidator(HashType.Op_Hash_256).validate(privateKey)
        ).to.be.equal('A proof should be 64 chars long.')
    })

    it('should throw error if private key length is not 64 when a 64 char long hash is specified as a string', () => {
        const privateKey = '46CHARS000000000000000000000000000000000000000'
        expect(
            new ProofValidator('Op_Hash_256').validate(privateKey)
        ).to.be.equal('A proof should be 64 chars long.')
    })
})
