import {expect} from 'chai';
import {HashAlgorithmValidator} from '../../src/validators/hashAlgorithm.validator';

describe('hashAlgorithm validator', () => {

    it('default case', () => {
        expect(new HashAlgorithmValidator().validate(0)).to.be.equal(undefined);
        expect(new HashAlgorithmValidator().validate(1)).to.be.equal(undefined);
        expect(new HashAlgorithmValidator().validate(2)).to.be.equal(undefined);
        expect(new HashAlgorithmValidator().validate(3)).to.be.equal(undefined);
    });

    it('should throw error if hashAlgorithm is unknown', () => {
        const value = 10;
        expect(() => {
            new HashAlgorithmValidator().validate(value);
        }).to.throws('Hash algorithm must be one of ' +
            '(0: Op_Sha3_256, 1: Op_Keccak_256, 2: Op_Hash_160, 3: Op_Hash_256)');
    });
});
