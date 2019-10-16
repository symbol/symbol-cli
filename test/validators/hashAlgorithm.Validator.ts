import {expect} from 'chai';
import {HashAlgorithmValidator} from '../../src/validators/hashAlgorithm.Validator';

describe('hashAlgorithm value', () => {
    it('Valid value: 0', () => {
        const value = 0;
        expect(new HashAlgorithmValidator().validate(value, {name: 'value', source: value.toString()})).to.be.equal(undefined);
    });

    it('Valid value: 1', () => {
        const value = 1;
        expect(new HashAlgorithmValidator().validate(value, {name: 'value', source: String(value)})).to.be.equal(undefined);
    });

    it('Valid value: 2', () => {
        const value = 2;
        expect(new HashAlgorithmValidator().validate(value, {name: 'value', source: String(value)})).to.be.equal(undefined);
    });

    it('Valid value: 3', () => {
        const value = 3;
        expect(new HashAlgorithmValidator().validate(value, {name: 'value', source: String(value)})).to.be.equal(undefined);
    });

    it('Invalid value: 10', () => {
        const value = 10;
        expect(() => {
            new HashAlgorithmValidator().validate(value, {name: 'value', source: String(value)});
        }).to.throws('hashAlgorithm must be one of ' + HashAlgorithmValidator.hashAlgorithm);
    });
});
