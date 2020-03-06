import {AccountOperationRestrictionView} from '../../../../../src/views/transactions/details/transaction-types'
import {
 operation1, operation2, operation3, unsignedAccountOperationRestriction1,
} from '../../../../mocks/transactions/accountOperationRestriction.mock'
import {expect} from 'chai'
import {TransactionType} from 'symbol-sdk'

describe('AccountOperationRestrictionView', () => {
 it('should return a view', () => {
  const view = AccountOperationRestrictionView.get(unsignedAccountOperationRestriction1)
  expect(view['Account restriction flag']).equal('AllowIncomingTransactionType')
  expect(view['Addition 1 of 2']).equal(TransactionType[operation1])
  expect(view['Addition 2 of 2']).equal(TransactionType[operation2])
  expect(view['Deletion 1 of 1']).equal(TransactionType[operation3])
 })
})
