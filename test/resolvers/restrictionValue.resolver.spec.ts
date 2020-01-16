import { expect } from 'chai';
import { UInt64 } from 'nem2-sdk';
import { RestrictionValueResolver } from '../../src/resolvers/restrictionValue.resolver';

describe('Restriction value resolver', () => {

    describe('resolve', () => {

        it('should return UInt64 value', () => {
            const newRestrictionValue = '123';
            const profileOptions = { newRestrictionValue } as any;
            expect(new RestrictionValueResolver().resolve(profileOptions).toHex())
                .to.be.equal(UInt64.fromNumericString('123').toHex());
        });

        it('should throw err, when input letters', () => {
            const newRestrictionValue = '123as';
            const profileOptions = { newRestrictionValue } as any;
            expect(() => new RestrictionValueResolver().resolve(profileOptions))
                .to.throws(Error);
        });
    });

    describe('optional resolve', () => {

        it('should return UInt64 value', () => {
            const previousRestrictionValue = '123';
            const profileOptions = { previousRestrictionValue } as any;
            expect(new RestrictionValueResolver().optionalResolve(profileOptions).toHex())
                .to.be.equal(UInt64.fromNumericString('123').toHex());
        });

        it('should return default value', () => {
            const previousRestrictionValue = undefined;
            const profileOptions = { previousRestrictionValue } as any;
            expect(new RestrictionValueResolver().optionalResolve(profileOptions, 'previousRestrictionValue', '123').toHex())
                .to.be.equal(UInt64.fromNumericString('123').toHex());
        });

        it('should throw err, when input letters', () => {
            const previousRestrictionValue = '123as';
            const profileOptions = { previousRestrictionValue } as any;
            expect(() => new RestrictionValueResolver().optionalResolve(profileOptions))
                .to.throws(Error);
        });
    });
});
