import {MultisigAccountModificationView} from '../../../../../src/views/transactions/details/transaction-types'
import {account1, account2, account3} from '../../../../mocks/accounts.mock'
import {unsignedMultisigAccountModification1} from '../../../../mocks/transactions/multisigAccountModification.mock'
import {expect} from 'chai'

describe('MultisigAccountModificationView', () => {
 it('should return a view', () => {
  const view = MultisigAccountModificationView.get(unsignedMultisigAccountModification1)
  expect(view['Min approval delta']).equal('2')
  expect(view['Min removal delta']).equal('1')
  expect(view['Public key addition (1 / 2)']).equal(account1.address.pretty())
  expect(view['Public key addition (2 / 2)']).equal(account2.address.pretty())
  expect(view['Public key deletion (1 / 1)']).equal(account3.address.pretty())
 })
})
