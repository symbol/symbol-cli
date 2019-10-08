import {expect} from 'chai';
import {
    AccountRestrictionDirectionValidator,
    OperationRestrictionTypeValidator,
    RestrictionTypeValidator,
} from '../../src/validators/modificationAction.validator';

describe('restriction type validator', () => {
    it('valid value MODIFY_MULTISIG_ACCOUNT', () => {
        const value = 'MODIFY_MULTISIG_ACCOUNT';
        expect(new OperationRestrictionTypeValidator().validate(value, {name: 'value', source: value}))
            .to.be.equal(undefined);
    });

    it('invalid value', () => {
        const value = '123';
        const operationRestrictionTypeValidator = new OperationRestrictionTypeValidator();
        expect(() => {
            operationRestrictionTypeValidator.validate(value, {name: 'value', source: value});
        }).to.throws('Wrong transaction type. Transaction type must be one of ' + operationRestrictionTypeValidator.getTransactionType());
    });
});

describe('Account restriction direction validator', () => {
    it('valid direction incoming', () => {
        const value = 'incoming';
        expect(new AccountRestrictionDirectionValidator().validate(value, {name: 'value', source: value}))
            .to.be.equal(undefined);
    });

    it('valid direction outgoing', () => {
        const value = 'outgoing';
        expect(new AccountRestrictionDirectionValidator().validate(value, {name: 'value', source: value}))
            .to.be.equal(undefined);
    });

    it('invalid value', () => {
        const value = '123';
        expect(() => {
            new AccountRestrictionDirectionValidator().validate(value, {name: 'value', source: value});
        }).to.throws('restrictionDirection must be one of \'incomling\' or \'outgoing\'');
    });
});

describe('Restriction type validator', () => {
    it('valid value allow', () => {
        const value = 'allow';
        expect(new RestrictionTypeValidator().validate(value, {name: 'value', source: value}))
            .to.be.equal(undefined);
    });

    it('valid value block', () => {
        const value = 'block';
        expect(new RestrictionTypeValidator().validate(value, {name: 'value', source: value}))
            .to.be.equal(undefined);
    });

    it('invalid value', () => {
        const value = '1';
        expect(() => {
            new RestrictionTypeValidator().validate(value, {name: 'value', source: value});
        }).to.throws('restrictionType must be one of \'allow\' or \'block\'');
    });
});
