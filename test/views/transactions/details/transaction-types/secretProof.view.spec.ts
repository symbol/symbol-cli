import {SecretProofView} from '../../../../../src/views/transactions/details/transaction-types'
import {account1} from '../../../../mocks/accounts.mock'
import {unsignedSecretProof1} from '../../../../mocks/transactions/secretProof.mock'
import {expect} from 'chai'

describe('SecretProofView', () => {
 it('should return a view', () => {
  const view = SecretProofView.get(unsignedSecretProof1)
  expect(view['Recipient']).equal(account1.address.pretty())
  expect(view['Hash type']).equal('Op_Sha3_256')
  expect(view['Secret']).equal('9b3155b37159da50aa52d5967c509b410f5a36a3b1e31ecb5ac76675d79b4a5e')
  expect(view['Proof']).equal('B778A39A3663719DFC5E48C9D78431B1E45C2AF9DF538782BF199C189DABEAC7')
 })
})
