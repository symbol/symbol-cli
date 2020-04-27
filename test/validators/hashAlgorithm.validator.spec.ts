import {HashAlgorithmValidator} from '../../src/validators/hashAlgorithm.validator'
import {expect} from 'chai'

describe('hashAlgorithm validator', () => {

    it('default case', () => {
        expect(new HashAlgorithmValidator().validate('Op_Sha3_256')).to.be.equal(true)
        expect(new HashAlgorithmValidator().validate('Op_Hash_160')).to.be.equal(true)
        expect(new HashAlgorithmValidator().validate('Op_Hash_256')).to.be.equal(true)
    })

    it('should throw error if hashAlgorithm is unknown', () => {
        const value = 'Op_Unknown'
        expect(
            new HashAlgorithmValidator().validate(value)
        ).to.include('Hash algorithm must be one of')
    })
})
