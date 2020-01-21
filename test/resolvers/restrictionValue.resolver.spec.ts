import {expect} from 'chai';
import {RestrictionValueResolver} from '../../src/resolvers/restrictionValue.resolver';

describe('Restriction value resolver', () => {

    describe('resolve', () => {

        it('should return UInt64 value', () => {
            const newRestrictionValue = '123';
            const profileOptions = { newRestrictionValue } as any;
            expect(new RestrictionValueResolver().resolve(profileOptions))
                .to.be.equal('123');
        });

        it('should throw err, when input letters', () => {
            const newRestrictionValue = '123as';
            const profileOptions = { newRestrictionValue } as any;
            expect(() => new RestrictionValueResolver().resolve(profileOptions))
                .to.throws(Error);
        });
    });

});
