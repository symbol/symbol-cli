import {NamespaceMetadataView} from '../../../../../src/views/transactions/details/transaction-types'
import {account1} from '../../../../mocks/accounts.mock'
import {unsignedNamespaceMetadata1} from '../../../../mocks/transactions/namespaceMetadata.mock'
import {Convert} from 'symbol-sdk'
import {expect} from 'chai'

describe('NamespaceMetadataView', () => {
 it('should return a view', () => {
  const view = NamespaceMetadataView.get(unsignedNamespaceMetadata1)
  expect(view['Target public key']).equal(account1.publicKey)
  expect(view['Scoped metadata key']).equal('00000000000003E8')
  expect(view['Target namespace Id']).equal('symbol.xym (E74B99BA41F4AFEE)')
  expect(view['Value size delta']).equal('1')
  expect(view['Value']).equal(Convert.uint8ToUtf8(new Uint8Array(10)))
 })
})
