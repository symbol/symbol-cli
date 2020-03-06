import {MosaicDefinitionView} from '../../../../../src/views/transactions/details/transaction-types'
import {mosaicId1} from '../../../../mocks/mosaics.mock'
import {unsignedMosaicDefinition1} from '../../../../mocks/transactions/mosaicDefinition.mock'
import {expect} from 'chai'

describe('MosaicDefinitionView', () => {
 it('should return a view', () => {
  const view = MosaicDefinitionView.get(unsignedMosaicDefinition1)
  expect(view['Mosaic Id']).equal(mosaicId1.toHex())
  expect(view['Duration']).equal('1,000 blocks')
  expect(view['Divisibility']).equal('3')
  // tslint:disable-next-line:no-unused-expression
  expect(view['Supply mutable']).equal('true')
  // tslint:disable-next-line:no-unused-expression
  expect(view['Transferable']).equal('true')
  // tslint:disable-next-line:no-unused-expression
  expect(view['Restrictable']).equal('true')
 })
})
