import {AccountMetadataView} from '../../../../../src/views/transactions/details/transaction-types'
import {account1} from '../../../../mocks/accounts.mock'
import {unsignedAccountMetadata1} from '../../../../mocks/transactions/accountMetadata.mock'
import {Convert} from 'symbol-sdk'
import {expect} from 'chai'

describe('AccountMetadataView', () => {
 it('should return a view', () => {
  const view = AccountMetadataView.get(unsignedAccountMetadata1)
  expect(view['Target public key']).equal(account1.publicKey)
  expect(view['Scoped metadata key']).equal('00000000000003E8')
  expect(view['Value size delta']).equal('1')
  expect(view['Value']).equal(Convert.uint8ToUtf8(new Uint8Array(10)))
 })
})
