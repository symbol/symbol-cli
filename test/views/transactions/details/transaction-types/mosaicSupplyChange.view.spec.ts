import {MosaicSupplyChangeView} from '../../../../../src/views/transactions/details/transaction-types'
import {mosaicId1} from '../../../../mocks/mosaics.mock'
import {unsignedMosaicSupplyChange1} from '../../../../mocks/transactions/mosaicSupplyChange.mock'
import {expect} from 'chai'

describe('MosaicSupplyChangeView', () => {
 it('should return a view', () => {
  const view = MosaicSupplyChangeView.get(unsignedMosaicSupplyChange1)
  expect(view['Mosaic Id']).equal(mosaicId1.toHex())
  expect(view['Direction']).equal('Increase supply')
  expect(view['Delta']).equal('10')
 })
})
