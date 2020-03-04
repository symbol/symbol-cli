import {expect} from 'chai'
import {MosaicRestrictionType} from 'symbol-sdk'
import {RestrictionTypeResolver} from '../../src/resolvers/restrictionType.resolver'

describe('Restriction type resolver', () => {

    describe('resolve', () => {

        it('should return one of MosaicRestrictionType', async () => {
            const newRestrictionType = 'EQ'
            const profileOptions = { newRestrictionType } as any
            expect(await new RestrictionTypeResolver().resolve(profileOptions))
                .to.be.equal(MosaicRestrictionType.EQ)
        })

        it('should change key', async () => {
            const key = 'EQ'
            const profileOptions = { key } as any
            expect(await new RestrictionTypeResolver()
                .resolve(profileOptions, undefined, 'altText', 'key'))
                .to.be.equal(MosaicRestrictionType.EQ)
        })

    })

})
