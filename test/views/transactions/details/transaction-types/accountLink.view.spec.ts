import {AccountLinkView} from '../../../../../src/views/transactions/details/transaction-types'
import {account1} from '../../../../mocks/accounts.mock'
import {unsignedAccountLink1} from '../../../../mocks/transactions/accountLink.mock'
import {LinkAction} from 'symbol-sdk'
import {expect} from 'chai'

describe('AccountLinkView', () => {
 it('should return a view', () => {
  const view = AccountLinkView.get(unsignedAccountLink1)
  expect(view['Action']).equal(LinkAction[LinkAction.Link])
  expect(view['Remote public key']).equal(account1.publicKey)
 })
})
