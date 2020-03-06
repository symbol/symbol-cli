import {MosaicAddressRestrictionView} from '../../../../../src/views/transactions/details/transaction-types'
import {account1} from '../../../../mocks/accounts.mock'
import {namespaceId1} from '../../../../mocks/namespaces.mock'
import {unsignedMosaicAddressRestriction1} from '../../../../mocks/transactions/mosaicAddressRestriction.mock'
import {expect} from 'chai'

describe('MosaicAddressRestrictionView', () => {
 it('should return a view', () => {
  const view = MosaicAddressRestrictionView.get(unsignedMosaicAddressRestriction1)
  expect(view['Mosaic id']).equal(namespaceId1.toHex())
  expect(view['Restriction key']).equal('0000000000000001')
  expect(view['Target address']).equal(account1.address.pretty())
  expect(view['Previous restriction value']).equal('9')
  expect(view['New restriction value']).equal('8')
 })
})
