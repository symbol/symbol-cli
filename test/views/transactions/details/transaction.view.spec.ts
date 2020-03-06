import {TransactionView} from '../../../../src/views/transactions/details/transaction.view'
import {unsignedTransfer2} from '../../../mocks/transactions/index'
import {assert, expect} from 'chai'

describe('Transaction view', () => {
 it('TransactionView render should return a non-empty array', () => {
  const transactionView = new TransactionView(unsignedTransfer2).render()
  assert.typeOf(transactionView, 'array', 'transactionView.render is an array')
  expect(transactionView.length).equal(8)
 })
})
