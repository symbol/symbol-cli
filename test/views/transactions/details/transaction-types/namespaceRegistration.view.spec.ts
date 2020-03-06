import {NamespaceRegistrationView} from '../../../../../src/views/transactions/details/transaction-types'
import {namespaceId1} from '../../../../mocks/namespaces.mock'
import {unsignedNamespaceRegistration1, unsignedSubNamespaceRegistration1} from '../../../../mocks/transactions/namespaceRegistration.mock'
import {expect} from 'chai'

describe('NamespaceRegistrationView', () => {
 it('should return a view of a root namespace registration', () => {
  const view = NamespaceRegistrationView.get(unsignedNamespaceRegistration1)
  expect(view['Namespace name']).equal('root-test-namespace')
  expect(view['Type']).equal('Root namespace')
  expect(view['Duration']).equal('1000 blocks')
  // tslint:disable-next-line:no-unused-expression
  expect(view['Parent Id']).to.be.undefined
 })

 it('should return a view of a sub namespace registration', () => {
  const view = NamespaceRegistrationView.get(unsignedSubNamespaceRegistration1)
  expect(view['Namespace name']).equal('sub-test-namespace')
  expect(view['Type']).equal('Sub namespace')
  expect(view['Parent Id']).equal(namespaceId1.toHex())
  // tslint:disable-next-line:no-unused-expression
  expect(view['Duration']).to.be.undefined
 })
})
