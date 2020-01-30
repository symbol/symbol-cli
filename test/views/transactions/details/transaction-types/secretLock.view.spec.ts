import {expect} from 'chai'
import {SecretLockView} from '../../../../../src/views/transactions/details/transaction-types'
import {unsignedSecretLock1} from '../../../../mocks/transactions/secretLock.mock'

describe('SecretLockView', () => {
 it('should return a view', () => {
  const view = SecretLockView.get(unsignedSecretLock1)
  expect(view['Recipient']).equal('alice (9CF66FB0CFEED2E0)')
  expect(view['Mosaic (1/1)']).equal('1,234,567,890 symbol.xym (E74B99BA41F4AFEE)')
  expect(view['Duration']).equal('100')
  expect(view['Hash type']).equal('Op_Keccak_256')
  expect(view['Secret']).equal('241c1d54c18c8422def03aa16b4b243a8ba491374295a1a6965545e6ac1af314')
 })
})
