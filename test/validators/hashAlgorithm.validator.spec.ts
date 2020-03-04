import {expect} from 'chai'
import {HashAlgorithmValidator} from '../../src/validators/hashAlgorithm.validator'

describe('hashAlgorithm validator', () => {

    it('default case', () => {
        expect(new HashAlgorithmValidator().validate('Op_Sha3_256')).to.be.equal(true)
        expect(new HashAlgorithmValidator().validate('Op_Keccak_256')).to.be.equal(true)
        expect(new HashAlgorithmValidator().validate('Op_Hash_160')).to.be.equal(true)
        expect(new HashAlgorithmValidator().validate('Op_Hash_256')).to.be.equal(true)
    })

    it('should throw error if hashAlgorithm is unknown', () => {
        const value = 'Op_Unknown'
        expect(
            new HashAlgorithmValidator().validate(value)
        ).to.be.equal('Hash algorithm must be one of ' +
            '(Op_Sha3_256, Op_Keccak_256, Op_Hash_160, Op_Hash_256)')
    })
})
