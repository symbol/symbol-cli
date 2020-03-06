import {TransferView} from '../../../../../src/views/transactions/details/transaction-types/transfer.view'
import {unsignedTransfer1, unsignedTransfer2} from '../../../../mocks/transactions/transfer.mock'
import {expect} from 'chai'
import {Address} from 'symbol-sdk'

describe('TransferView', () => {
 it('should return a view of a transfer', () => {
  const view = TransferView.get(unsignedTransfer1)
  const expectedRecipientAddress = unsignedTransfer1.recipientAddress as Address
  expect(view['Recipient']).deep.equal(expectedRecipientAddress.pretty())
  expect(view['Message']).equal(unsignedTransfer1.message.payload)
  expect(view['Mosaic (1/1)']).equal('1 D525AD41D95FCF29')
 })

 it('should return a view of a transfer with namespaces as recipient and mosaic', () => {
  const view = TransferView.get(unsignedTransfer2)
  expect(view['Recipient']).equal('alice (9CF66FB0CFEED2E0)')
  expect(view['Message']).equal(unsignedTransfer1.message.payload)
  expect(view['Mosaic (1/2)']).equal('1 D525AD41D95FCF29')
  expect(view['Mosaic (2/2)']).equal('1,234,567,890 symbol.xym (E74B99BA41F4AFEE)')
 })
})
