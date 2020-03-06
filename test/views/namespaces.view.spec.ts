
import {NamespacesView} from '../../src/views/namespaces.view'
import {namespaceId1, namespaceId2, namespaceId3} from '../mocks/namespaces.mock'
import {expect} from 'chai'

describe('Mosaics view', () => {
 it('getMosaicLabel should return labels for mosaic Id and namespaceId', () => {
  expect(NamespacesView.getNamespaceLabel(namespaceId1)).equal('symbol.xym (E74B99BA41F4AFEE)')
  expect(NamespacesView.getNamespaceLabel(namespaceId2)).equal('alice (9CF66FB0CFEED2E0)')
  expect(NamespacesView.getNamespaceLabel(namespaceId3)).equal('bob (AE7CBE4B2C3F3AB7)')
 })
})
