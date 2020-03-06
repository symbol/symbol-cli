import {RestrictionValueResolver} from '../../src/resolvers/restrictionValue.resolver'
import {expect} from 'chai'

describe('Restriction value resolver', () => {

    describe('resolve', () => {

        it('should return UInt64 value', async () => {
            const newRestrictionValue = '123'
            const options = { newRestrictionValue } as any
            expect(await new RestrictionValueResolver().resolve(options))
                .to.be.equal('123')
        })

        it('should change key', async () => {
            const key = '123'
            const options = { key } as any
            expect(await new RestrictionValueResolver()
                .resolve(options, 'altText', 'key'))
                .to.be.equal('123')
        })

    })

})
