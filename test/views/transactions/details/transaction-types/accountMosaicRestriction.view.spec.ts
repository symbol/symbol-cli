import {AccountMosaicRestrictionView} from '../../../../../src/views/transactions/details/transaction-types'
import {mosaicId1, mosaicId2} from '../../../../mocks/mosaics.mock'
import {unsignedAccountMosaicRestriction1} from '../../../../mocks/transactions/accountMosaicRestriction.mock'
import {expect} from 'chai'

describe('AccountMosaicRestrictionView', () => {
 it('should return a view', () => {
  const view = AccountMosaicRestrictionView.get(unsignedAccountMosaicRestriction1)
  expect(view['Account restriction flag']).equal('AllowMosaic')
  expect(view['Addition 1 of 1']).equal(mosaicId1.toHex())
  expect(view['Deletion 1 of 2']).equal(mosaicId2.toHex())
  expect(view['Deletion 2 of 2']).equal('symbol.xym (E74B99BA41F4AFEE)')
 })
})
