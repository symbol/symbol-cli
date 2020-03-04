import {expect} from 'chai'
import {RestrictionValueResolver} from '../../src/resolvers/restrictionValue.resolver'

describe('Restriction value resolver', () => {

    describe('resolve', () => {

        it('should return UInt64 value', async () => {
            const newRestrictionValue = '123'
            const profileOptions = { newRestrictionValue } as any
            expect(await new RestrictionValueResolver().resolve(profileOptions))
                .to.be.equal('123')
        })

        it('should change key', async () => {
            const key = '123'
            const profileOptions = { key } as any
            expect(await new RestrictionValueResolver()
                .resolve(profileOptions, undefined, 'altText', 'key'))
                .to.be.equal('123')
        })

    })

})
