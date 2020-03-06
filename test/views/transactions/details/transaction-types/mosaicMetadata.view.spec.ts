import {MosaicMetadataView} from '../../../../../src/views/transactions/details/transaction-types'
import {account1} from '../../../../mocks/accounts.mock'
import {mosaicId1} from '../../../../mocks/mosaics.mock'
import {unsignedMosaicMetadata1} from '../../../../mocks/transactions/mosaicMetadata.mock'
import {Convert} from 'symbol-sdk'
import {expect} from 'chai'

describe('MosaicMetadataView', () => {
 it('should return a view', () => {
  const view = MosaicMetadataView.get(unsignedMosaicMetadata1)
  expect(view['Target public key']).equal(account1.publicKey)
  expect(view['Scoped metadata key']).equal('00000000000003E8')
  expect(view['Target mosaic Id']).equal(mosaicId1.toHex())
  expect(view['Value size delta']).equal('1')
  expect(view['Value']).equal(Convert.uint8ToUtf8(new Uint8Array(10)))
 })
})
