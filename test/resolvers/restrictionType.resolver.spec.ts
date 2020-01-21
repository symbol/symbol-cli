import {expect} from 'chai';
import {MosaicRestrictionType} from 'nem2-sdk';
import {RestrictionTypeResolver} from '../../src/resolvers/restrictionType.resolver';

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

});
