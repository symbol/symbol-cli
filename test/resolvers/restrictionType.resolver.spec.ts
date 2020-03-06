import {RestrictionTypeResolver} from '../../src/resolvers/restrictionType.resolver'
import {expect} from 'chai'
import {MosaicRestrictionType} from 'symbol-sdk'

describe('Restriction type resolver', () => {

    describe('resolve', () => {

        it('should return one of MosaicRestrictionType', async () => {
            const newRestrictionType = 'EQ'
            const options = { newRestrictionType } as any
            expect(await new RestrictionTypeResolver().resolve(options))
                .to.be.equal(MosaicRestrictionType.EQ)
        })

        it('should change key', async () => {
            const key = 'EQ'
            const options = { key } as any
            expect(await new RestrictionTypeResolver()
                .resolve(options, 'altText', 'key'))
                .to.be.equal(MosaicRestrictionType.EQ)
        })

    })

})
