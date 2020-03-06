import {AccountAddressRestrictionView} from '../../../../../src/views/transactions/details/transaction-types'
import {account1, account2, account3} from '../../../../mocks/accounts.mock'
import {unsignedAccountAddressRestriction1} from '../../../../mocks/transactions/accountAddressRestriction.mock'
import {expect} from 'chai'

describe('AccountAddressRestrictionView', () => {
 it('should return a view', () => {
  const view = AccountAddressRestrictionView.get(unsignedAccountAddressRestriction1)
  expect(view['Account restriction flag']).equal('AllowIncomingAddress')
  expect(view['Addition 1 of 2']).equal(account1.address.pretty())
  expect(view['Addition 2 of 2']).equal(account2.address.pretty())
  expect(view['Deletion 1 of 1']).equal(account3.address.pretty())
 })
})
