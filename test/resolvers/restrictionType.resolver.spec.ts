import { expect } from 'chai';
import { MosaicRestrictionType } from 'nem2-sdk';
import { RestrictionTypeResolver } from '../../src/resolvers/restrictionType.resolver';

describe('Restriction type resolver', () => {

    describe('resolve', () => {

        it('should return one of MosaicRestrictionType', () => {
            const newRestrictionType = 'EQ';
            const profileOptions = { newRestrictionType } as any;
            expect(new RestrictionTypeResolver().resolve(profileOptions))
                .to.be.equal(MosaicRestrictionType['EQ']);
        });

        it('should throw err', () => {
            const newRestrictionType = '123';
            const profileOptions = { newRestrictionType } as any;
            expect(() => new RestrictionTypeResolver().resolve(profileOptions)).to.throws(Error);
        });
    });

    describe('optional resolve', () => {
        it('should return one of MosaicRestrictionType', () => {
            const previousRestrictionType = 'GT';
            const profileOptions = { previousRestrictionType } as any;
            expect(new RestrictionTypeResolver().optionalResolve(profileOptions))
                .to.be.equal(MosaicRestrictionType['GT']);
        });

        it('should return default value', () => {
            const previousRestrictionType = undefined;
            const profileOptions = { previousRestrictionType } as any;
            expect(new RestrictionTypeResolver().optionalResolve(profileOptions, 'previousRestrictionType', 'EQ'))
            .to.be.equal(MosaicRestrictionType['EQ']);
        });

        it('should throw err', () => {
            const previousRestrictionType = '123';
            const profileOptions = { previousRestrictionType } as any;
            expect(() => new RestrictionTypeResolver().optionalResolve(profileOptions)).to.throws(Error);
        });
    });
});
