
import {RecipientsView} from '../../src/views/recipients.view'
import {account1} from '../mocks/accounts.mock'
import {namespaceId1, namespaceId2} from '../mocks/namespaces.mock'
import {expect} from 'chai'

describe('Mosaics view', () => {
 it('getMosaicLabel should return labels for mosaic Id and namespaceId', () => {
  expect(RecipientsView.get(namespaceId1)).equal('symbol.xym (E74B99BA41F4AFEE)')
  expect(RecipientsView.get(namespaceId2)).equal('alice (9CF66FB0CFEED2E0)')
  expect(RecipientsView.get(account1.address)).equal(account1.address.pretty())
 })
})
