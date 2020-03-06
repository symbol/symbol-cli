import {MosaicGlobalRestrictionView} from '../../../../../src/views/transactions/details/transaction-types'
import {mosaicId1, mosaicId2} from '../../../../mocks/mosaics.mock'
import {unsignedMosaicGlobalRestriction1} from '../../../../mocks/transactions/mosaicGlobalRestriction.mock'
import {expect} from 'chai'

describe('MosaicGlobalRestrictionView', () => {
 it('should return a view', () => {
  const view = MosaicGlobalRestrictionView.get(unsignedMosaicGlobalRestriction1)
  expect(view['Mosaic Id']).equal(mosaicId1.toHex())
  expect(view['Reference mosaic Id']).equal(mosaicId2.toHex())
  expect(view['Restriction key']).equal('0000000000000001')
  expect(view['Previous restriction value']).equal('9')
  expect(view['Previous restriction type']).equal('EQ')
  expect(view['New restriction value']).equal('8')
  expect(view['New restriction type']).equal('GE')
 })
})
